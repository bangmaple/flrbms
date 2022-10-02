import {BadRequestException, forwardRef, Inject, Injectable, Logger,} from '@nestjs/common';
import {Rooms} from '../models';
import {RoomsRepository} from '../repositories';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {RoomsPaginationParams} from '../dto/rooms-pagination.dto';
import {RoomHistService} from './room-hist.service';
import {DataSource} from 'typeorm';
import {BookingRoomService} from './booking-room.service';
import {RoomAddRequestPayload} from '../payload/request/room-add.request.payload';
import {getConfigFileLoaded} from '../controllers/global-config.controller';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: RoomsRepository,
    private readonly histService: RoomHistService,
    @Inject(forwardRef(() => BookingRoomService))
    private readonly bookingRoomService: BookingRoomService
  ) {
  }

  async getAll(request: RoomsPaginationParams) {
    try {
      const result = await this.repository.searchRoom(request);
      if (
        result.meta.totalPages > 0 &&
        result.meta.currentPage > result.meta.totalPages
      ) {
        throw new BadRequestException('Current page is over');
      }
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message || 'One or more parameters is invalid'
      );
    }
  }

  async getRoomNames() {
    try {
      return await this.repository.findRoomNames();
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getRoomsByRoomType(roomTypeId: string): Promise<Rooms[]> {
    try {
      return await this.repository.getRoomsByRoomType(roomTypeId);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ??
        'An error occurred while getting rooms by type ' + roomTypeId
      );
    }
  }

  async getRoomName(id: string) {
    try {
      return await this.repository.getRoomName(id);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'An error occurred while retrieving this room'
      );
    }
  }

  async findById(id: string): Promise<Rooms> {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Room does not found with the provided id'
        );
      }
      const result = await this.repository.findById(id);
      if (!result) {
        throw new BadRequestException('This room is already deleted');
      }
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'An error occurred while retrieving this room'
      );
    }
  }

  async add(
    user: KeycloakUserInstance,
    room: RoomAddRequestPayload
  ): Promise<Rooms> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const MAX_ROOM_CAPACITY = getConfigFileLoaded().maxRoomCapacity;
    try {
      const roomDeletedSameName = await this.repository.getRoomDeletedByName(
        room.name
      );

      let roomAdded;

      if (roomDeletedSameName) {
        roomAdded = await this.repository.restoreDeletedRoomById(
          room,
          user.account_id,
          roomDeletedSameName.id,
          queryRunner
        );
      } else {
        const isExisted = await this.repository.isExistedByNameActive(
          room.name
        );
        if (isExisted) {
          throw new BadRequestException(
            'There already exists a room with the this name. Try with another name.'
          );
        }
        if (room.capacity < 1 || room.capacity > MAX_ROOM_CAPACITY) {
          throw new BadRequestException('Only accept room capacity which is greater than 0 and less than or equal to 1000')
        }
        roomAdded = await this.repository.createNewRoom(
          room,
          user.account_id,
          queryRunner
        );
        await this.histService.createNew(roomAdded, queryRunner);
      }

      await queryRunner.commitTransaction();
      return roomAdded;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      if (
        e.message.includes('constraint') &&
        e.message.includes('rooms_room_type_id_fk')
      ) {
        throw new BadRequestException(
          'There is no room type with the provided id'
        );
      }
      throw new BadRequestException(
        e.message ?? 'Error occurred while adding this room'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateById(accountId: string, id: string, body: RoomAddRequestPayload) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const isExisted = await this.repository.existsById(id);

    const MAX_ROOM_CAPACITY = getConfigFileLoaded().maxRoomCapacity;
    if (!isExisted) {
      throw new BadRequestException('Room does not found with the provided id');
    }
    const data = await this.repository.findById(id);
    if (data === undefined) {
      throw new BadRequestException('This room is already deleted or disabled');
    }
    const isExistedByName = await this.repository.isExistedByNameActiveUpdate(
      body.name,
      id
    );
    if (isExistedByName) {
      throw new BadRequestException(
        'There already exists a room with the this name. Try with another name.'
      );
    }
    if (body.capacity < 1 || body.capacity > MAX_ROOM_CAPACITY) {
      throw new BadRequestException('Only accept room capacity which is greater than 0 and less than or equal to 1000')
    }
    try {
      const roomUpdated = await this.repository.updateById(
        accountId,
        id,
        body,
        queryRunner
      );

      await this.histService.createNew(roomUpdated, queryRunner);

      await queryRunner.commitTransaction();
      return roomUpdated;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      if (
        e.message.includes('constraint') &&
        e.message.includes('rooms_room_type_id_fk')
      ) {
        throw new BadRequestException(
          'There is no room type with the provided id'
        );
      }
      throw new BadRequestException(
        e.message ?? 'Error occurred while updating this room'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateTypeThenRestore(
    accountId: string,
    id: string,
    body: { type: string }
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const isExisted = await this.repository.existsById(id);
    if (!isExisted) {
      throw new BadRequestException('Room does not found with the provided id');
    }
    const data = await this.repository.findById(id);
    if (data === undefined) {
      throw new BadRequestException('This room is already deleted');
    }
    try {
      const roomUpdated = await this.repository.updateTypeThenRestore(
        accountId,
        id,
        body,
        queryRunner
      );

      await this.histService.createNew(roomUpdated, queryRunner);

      await queryRunner.commitTransaction();
      return roomUpdated;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      if (
        e.message.includes('constraint') &&
        e.message.includes('rooms_room_type_id_fk')
      ) {
        throw new BadRequestException(
          'There is no room type with the provided id'
        );
      }
      throw new BadRequestException(
        e.message ?? 'Error occurred while updating this room'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async disableById(accountId: string, id: string): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Room does not found with the provided id'
        );
      }
      const isDisabled = await this.repository.checkIfRoomIsDisabledById(id);
      if (isDisabled) {
        throw new BadRequestException('This room is already disabled');
      }
      const isDeleted = await this.repository.checkIfRoomIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException(
          'This room is already deleted, can not disable'
        );
      }
      const data = await this.repository.findById(id);
      const listRequestBooked =
        await this.bookingRoomService.getRequestByRoomId(id);
      if (listRequestBooked.length > 0) {
        const reason = `Room ${data?.name} was deleted. Request in this room was auto cancelled`;
        for (let i = 0; i < listRequestBooked.length; i++) {
          await this.bookingRoomService.cancelRequest(
            accountId,
            listRequestBooked[i].id,
            reason,
            queryRunner
          );
        }
      }
      const room = await this.repository.disableById(
        accountId,
        id,
        queryRunner
      );
      await this.histService.createNew(room, queryRunner);

      await queryRunner.commitTransaction();
      return room;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getDisabledRooms(search: string): Promise<Rooms[]> {
    try {
      return await this.repository.findDisabledRooms(search);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'An error occurred while getting disabled rooms'
      );
    }
  }

  async handleRestoreDisabledRoomById(accountId: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Room does not found with the provided id'
        );
      }
      const isDeleted = await this.repository.checkIfRoomIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException('This room is already deleted');
      }
      const isDisabled = await this.repository.checkIfRoomIsDisabledById(id);
      if (!isDisabled) {
        throw new BadRequestException(
          'This room ID is now active. Cannot restore it'
        );
      }
      const room = await this.repository.restoreDisabledRoomById(
        accountId,
        id,
        queryRunner
      );

      await this.histService.createNew(room, queryRunner);
      await queryRunner.commitTransaction();
      return room;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        e.message ??
        'Error occurred while restore the disabled status of this room'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteById(accountId: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Room does not found with the provided id'
        );
      }
      const isDeleted = await this.repository.checkIfRoomIsDeletedById(id);
      if (isDeleted) {
        throw new BadRequestException('This room is already deleted');
      }
      const data = await this.repository.findById(id);

      const listRequestBooked =
        await this.bookingRoomService.getRequestByRoomId(id);
      if (listRequestBooked.length > 0) {
        const reason = `Room ${data?.name} was deleted. Request in this room was auto cancelled`;
        for (let i = 0; i < listRequestBooked.length; i++) {
          await this.bookingRoomService.cancelRequest(
            accountId,
            listRequestBooked[i].id,
            reason,
            queryRunner
          );
        }
      }
      const room = await this.repository.deleteById(accountId, id, queryRunner);
      await this.histService.createNew(room, queryRunner);
      await queryRunner.commitTransaction();

      return room;
    } catch (e) {
      this.logger.error(e.message);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getDeletedRooms(search: string): Promise<Rooms[]> {
    try {
      return await this.repository.findDeletedRooms(search);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(
        e.message ?? 'An error occurred while getting deleted rooms'
      );
    }
  }

  // async handleRestoreDeletedRoomById(accountId: string, id: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const isExisted = await this.repository.existsById(id);
  //     if (!isExisted) {
  //       throw new BadRequestException(
  //         'Room does not found with the provided id'
  //       );
  //     }
  //     const isDisabled = await this.repository.checkIfRoomIsDisabledById(id);
  //     if (isDisabled) {
  //       throw new BadRequestException('This room is already disabled');
  //     }
  //     const isDeleted = await this.repository.checkIfRoomIsDeletedById(id);
  //     if (!isDeleted) {
  //       throw new BadRequestException(
  //         'This room ID is now active. Cannot restore it'
  //       );
  //     }

  //     const room = await this.repository.restoreDeletedRoomById(
  //       accountId,
  //       id,
  //       queryRunner
  //     );
  //     await this.histService.createNew(room, queryRunner);
  //     await queryRunner.commitTransaction();
  //     return room;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     await queryRunner.rollbackTransaction();
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // getAllWithoutPagination(): Promise<Rooms[]> {
  //   try {
  //     return this.repository
  //       .createQueryBuilder('rooms')
  //       .where('rooms.disabled_at IS NULL')
  //       .andWhere('rooms.deleted_at IS NULL')
  //       .getMany();
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new BadRequestException(
  //       e.message ?? 'An error occurred while adding this room'
  //     );
  //   }
  // }

  // getRoomsFilterByNameAndType(payload: ChooseBookingRoomFilterPayload) {
  //   return this.repository.filterByNameAndType(payload);
  // }

  filterRoomFreeByRoomBooked(search: string, capacity: number, listIdRoomBooked: string[]) {
    return this.repository.filterRoomFreeByRoomBooked(search, capacity, listIdRoomBooked);
  }

  async findRoomIdAndCapacityByBetweenCapacity(capacity: number, occupiedRoomIds: string[]): Promise<{ id: string, roomName: string, roomType: string, capacity: number }> {
    const rooms = await this.repository.findRoomIdAndCapacity(occupiedRoomIds);
    return rooms.find((r) => capacity <= r.capacity);
  }

  async getOccupiedRoomsAtDateTime(date: string, checkInAt: string, checkOutAt: string): Promise<string[]> {
    return await this.repository.findOccupiedRoomsAtDateTime(date, checkInAt, checkOutAt);
  }
}
