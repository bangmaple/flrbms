import {BadRequestException, forwardRef, Inject, Injectable, Logger,} from '@nestjs/common';
import {SlotRepository} from '../repositories/slot.repository';
import {BookingRoomService} from './booking-room.service';
import {InjectDataSource} from '@nestjs/typeorm';
import {DataSource} from 'typeorm';
import {getConfigFileLoaded} from '../controllers/global-config.controller';
import {SlotsConfigRequestPayload} from '../payload/request/slot-config-request-add.payload';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

@Injectable()
export class SlotService {
  private readonly logger = new Logger(SlotService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repository: SlotRepository,
    @Inject(forwardRef(() => BookingRoomService))
    private readonly bookingRoomService: BookingRoomService
  ) {
  }

  async getAll() {
    try {
      // return Promise.resolve(Object.entries(getConfigFileLoaded().slots));
      return Promise.resolve(getConfigFileLoaded().slots);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  // async getAllByPagination(
  //   params: PaginationParams
  // ): Promise<Pagination<Slot> | Slot[]> {
  //   try {
  //     let result;
  //     if (!params || !params.page) {
  //       result = await this.repository.findAll();
  //     } else {
  //       result = await this.repository.findByPagination(params);
  //       if(result.meta.totalPages > 0 && result.meta.currentPage > result.meta.totalPages){
  //         throw new BadRequestException('Current page is over');
  //       }
  //     }
  //     return result;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // async getSlotNames() {
  //   try {
  //     return await this.repository.findSlotNames();
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // async getNumOfSlot(id: string) {
  //   try {
  //     const slot = await this.repository.getNumOfSlot(id);
  //     return slot;
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new BadRequestException('One or more parameters is invalid');
  //   }
  // }

  async getById(id: string) {
    try {
      const slotInfor = Promise.resolve(getConfigFileLoaded().slots).then(
        (slots) => {
          return {
            ...slots[id],
          };
        }
      );
      return slotInfor;
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  // async getById(id: string) {
  //   try {
  //     const data = await this.repository.findById(id);
  //     if (data === undefined) {
  //       throw new BadRequestException('This slot is already deleted');
  //     }
  //     return data;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // getAll(): Promise<Slot[]> {
  //   return this.repository.findAll();
  // }

  validateSlot(slot: SlotsConfigRequestPayload) {
    const isValidTimeStart =
      /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(slot.start);

    if (!isValidTimeStart) {
      throw new BadRequestException('Time start is not valid');
    }

    const isValidTimeEnd =
      /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(slot.end);

    if (!isValidTimeEnd) {
      throw new BadRequestException('Time end is not valid');
    }

    if (slot.end < slot.start) {
      throw new BadRequestException('Time end must be greater than time start');
    }
  }

  async addNewSlot(slot: SlotsConfigRequestPayload) {
    try {
      this.validateSlot(slot);

      await Promise.resolve(getConfigFileLoaded())
        .then((data) => {
          const slots = new Object(data.slots);
          const newSlotName = slot.name.toLowerCase().replace(/\s/g, '');

          const slotsArray = Object.values(slots);
          const isDuplicateTime = slotsArray.some((s) => {
            const result =
              (s.start <= slot.start && s.end > slot.start) ||
              (s.start < slot.end && s.end >= slot.end) ||
              (s.start > slot.start && s.end < slot.end);
            return result;
          });

          if (isDuplicateTime) {
            throw 'This time is duplicate';
          }

          const isDuplicateName = slotsArray.some((s) => {
            return s.name === slot.name;
          });

          if (isDuplicateName) {
            throw 'This name is duplicate';
          }

          fs.writeFileSync(
            './backend-config.yaml',
            yaml.dump({
              ...data,
              slots: {
                ...slots,
                [newSlotName]: slot,
              },
            })
          );
        })
        .catch((e) => {
          throw new BadRequestException(e);
        });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  async updateSlot(key: string, slot: SlotsConfigRequestPayload) {
    try {
      this.validateSlot(slot);
      const newSlotName = slot.name.toLowerCase().replace(/\s/g, '');

      await Promise.resolve(getConfigFileLoaded())
        .then((data) => {
          const slots = new Object(data.slots);

          const slotNameArray = Object.keys(slots);
          if (!slotNameArray.includes(key)) {
            throw `Don't have slot with key ${key}`;
          }
          const slotsArray = Object.entries(slots);
          const isDuplicateTime = slotsArray.some((s) => {
            const result =
              ((s[1].start <= slot.start && s[1].end > slot.start) ||
                (s[1].start < slot.end && s[1].end >= slot.end) ||
                (s[1].start > slot.start && s[1].end < slot.end)) &&
              s[0] !== key;
            return result;
          });

          if (isDuplicateTime) {
            throw 'This time is duplicate';
          }

          const isDuplicateName = slotsArray.some((s) => {
            return s[1].name === slot.name && s[0] !== key;
          });

          if (isDuplicateName) {
            throw 'This name is duplicate';
          }

          delete slots[key];

          fs.writeFileSync(
            './backend-config.yaml',
            yaml.dump({
              ...data,
              slots: {
                ...slots,
                [newSlotName]: slot,
              },
            })
          );
        })
        .catch((e) => {
          throw new BadRequestException(e);
        });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  async deleteSlot(key: string) {
    try {
      await Promise.resolve(getConfigFileLoaded())
        .then((data) => {
          const slots = new Object(data.slots);

          const slotNameArray = Object.keys(slots);
          if (!slotNameArray.includes(key)) {
            throw `Don't have slot with key ${key}`;
          }

          delete slots[key];

          fs.writeFileSync(
            './backend-config.yaml',
            yaml.dump({
              ...data,
              slots: {
                ...slots,
              },
            })
          );
        })
        .catch((e) => {
          throw new BadRequestException(e);
        });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  // async getDeletedSlots(search: string) {
  //   try {
  //     const slot = await this.repository.findDeletedByPagination(search);
  //     return slot;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }
  //
  // async restoreDeletedSlotById(accountId: string, id: string) {
  //   try {
  //     const isExisted = await this.repository.existsById(id);
  //     if (!isExisted) {
  //       throw new BadRequestException(
  //         'Slot does not found with the provided id'
  //       );
  //     }
  //     const data = await this.repository.findById(id);
  //     if (!data.deletedAt) {
  //       throw new BadRequestException(
  //         'This slot ID is now active. Cannot restore it'
  //       );
  //     } else {
  //       const isHaveSlotSameNameActive =
  //         await this.repository.isHaveSlotSameNameActive(data.name);
  //       if (isHaveSlotSameNameActive) {
  //         throw new BadRequestException(
  //           `Already have slot with name '${data.name}' active.
  //           Try other name or delete slot have name '${data.name}' before restore`
  //         );
  //       }
  //
  //       const isHaveSlotSameNumActive =
  //         await this.repository.isHaveSlotSameNumActive(data.slotNum);
  //       if (isHaveSlotSameNumActive) {
  //         throw new BadRequestException(
  //           `There already exists a slot with the same sequence number active.`
  //         );
  //       }
  //     }
  //
  //     const roomType = await this.repository.restoreDeletedById(accountId, id);
  //     // await this.histService.createNew(roomType);
  //     return roomType;
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }
}
