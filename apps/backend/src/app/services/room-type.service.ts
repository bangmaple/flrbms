import {BadRequestException, forwardRef, Inject, Injectable, Logger,} from '@nestjs/common';
import {PaginationParams} from '../dto/pagination.dto';
import {RoomTypeRepository} from '../repositories/room-type.repository';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';
import {RoomType} from '../models/room-type.entity';
import {Pagination} from 'nestjs-typeorm-paginate';
import {RoomTypeHistService} from './room-type-hist.service';
import {RoomsService} from './rooms.service';

@Injectable()
export class RoomTypeService {
  private readonly logger = new Logger(RoomTypeService.name);

  constructor(
    private readonly roomService: RoomsService,
    private readonly repository: RoomTypeRepository,
    private readonly histService: RoomTypeHistService
  ) {
  }

  async existsById(id: string): Promise<boolean> {
    return await this.repository.existsById(id);
  }

  async getRoomTypesWithPagination(
    pagination: PaginationParams
  ): Promise<Pagination<RoomType>> {
    try {
      const result = await this.repository.findRoomTypesByPagination(
        pagination
      );
      if (
        result.meta.totalPages > 0 &&
        result.meta.currentPage > result.meta.totalPages
      ) {
        throw new BadRequestException('Current page is over');
      }
      return result;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  getRoomTypeNames() {
    try {
      return this.repository.findRoomTypeName();
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getRoomTypeById(id: string): Promise<RoomType> {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Room type does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException('This room is already deleted');
      }
      return data;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async addRoomType(
    accountId: string,
    addRoomType: MasterDataAddRequestPayload
  ): Promise<RoomType> {
    try {
      const isExisted = await this.repository.isExistedByNameActive(
        addRoomType.name
      );
      if (isExisted) {
        throw new BadRequestException(
          'There already exists a room type with the this name. Try with another name.'
        );
      }

      const roomType = await this.repository.addNew(accountId, addRoomType);
      await this.histService.createNew(roomType);
      return roomType;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  async updateRoomTypeById(
    accountId: string,
    updatePayload: MasterDataAddRequestPayload,
    id: string
  ) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Room type does not found with the provided id'
        );
      }

      const isExistedName = await this.repository.isExistedByNameActiveUpdate(
        updatePayload.name,
        id
      );
      if (isExistedName) {
        throw new BadRequestException(
          'There already exists a room type with the this name. Try with another name.'
        );
      }

      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException('This room is already deleted');
      }
      const roomType = await this.repository.updateById(
        accountId,
        id,
        updatePayload
      );
      await this.histService.createNew(roomType);
      return roomType;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async deleteRoomTypeById(accountId: string, id: string) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Room type does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      const listRoomOfThisType = await this.roomService.getRoomsByRoomType(id);
      if (data === undefined) {
        throw new BadRequestException(
          'This room type is already deleted or disabled'
        );
      } else if (
        listRoomOfThisType !== undefined &&
        listRoomOfThisType.length > 0
      ) {
        throw new BadRequestException(
          'There are still rooms of this type, please change the type of those rooms before deleting type'
        );
      } else {
        const roomType = await this.repository.deleteById(accountId, id);
        await this.histService.createNew(roomType);
        return roomType;
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getDeletedRoomTypes(search: string) {
    try {
      const roomType = await this.repository.findDeletedByPagination(search);
      return roomType;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async restoreDeletedRoomTypeById(accountId: string, id: string) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Room type does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      if (data !== undefined) {
        throw new BadRequestException(
          'This room type ID is now active. Cannot restore it'
        );
      }
      const roomType = await this.repository.restoreDeletedById(accountId, id);
      await this.histService.createNew(roomType);
      return roomType;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async permanentDeleteRoomTypeById(id: string) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Room type does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      if (data !== undefined) {
        throw new BadRequestException(
          'Please delete this room type after permanently delete'
        );
      } else {
        await this.histService.deleteAllHist(id);
        return this.repository.permanentlyDeleteById(id);
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }
}
