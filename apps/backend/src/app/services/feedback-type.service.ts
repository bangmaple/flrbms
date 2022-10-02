import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {PaginationParams} from '../dto/pagination.dto';
import {MasterDataAddRequestPayload} from '../payload/request/master-data-add.request.payload';
import {FeedbackTypeRepository} from '../repositories';

@Injectable()
export class FeedbackTypeService {
  private readonly logger = new Logger(FeedbackTypeService.name);

  constructor(
    private readonly repository: FeedbackTypeRepository,
    // private readonly feedbackService: FeedbackService
  ) {
  }

  async getAllFeedbackTypes(param: PaginationParams) {
    try {
      const result = await this.repository.findByPagination(param);
      if (result.meta.totalPages > 0 && result.meta.currentPage > result.meta.totalPages) {
        throw new BadRequestException('Current page is over');
      }
      return result
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  getFeedbackTypeNames() {
    try {
      return this.repository.findFeedbackTypeName();
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getFeedbackTypeById(id: string) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Feedback type does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException('This feedback type is already deleted');
      }
      return data;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  async addNewFeedbackType(
    accountId: string,
    payload: MasterDataAddRequestPayload
  ) {
    try {
      const isExistedByName = await this.repository.isExistedByNameAdd(payload.name);
      if (isExistedByName) {
        throw new BadRequestException("There already exists a feedback type with the this name. Try with another name.")
      }
      return this.repository.addNew(accountId, payload);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  async updateFeedbackTypeById(
    accountId: string,
    id: string,
    payload: MasterDataAddRequestPayload
  ) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Feedback type does not found with the provided id'
        );
      }

      const isExistedByName = await this.repository.isExistedByNameUpdate(payload.name, id);
      if (isExistedByName) {
        throw new BadRequestException("There already exists a feedback type with the this name. Try with another name.")
      }

      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException('This feedback type is already deleted');
      }
      return this.repository.updateById(accountId, id, payload);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }


  async disableFeedbackTypeById(accountId: string, id: string) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Feedback type does not found with the provided id'
        );
      }
      const isDisabled = await this.repository.checkIfFeedbackTypeIsDisabledById(id);
      if (isDisabled) {
        throw new BadRequestException('This feedback type is already disabled');
      }
      const data = await this.repository.findById(id);
      if (data === undefined) {
        throw new BadRequestException('This type is already disabled');
      }

      return this.repository.disableById(accountId, id);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e.message);
    }
  }

  getDisabledFeedbackTypes(search: string) {
    try {
      return this.repository.findDisabledByPagination(search);
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async restoreDisabledFeedbackTypeById(accountId: string, id: string) {
    try {
      const isExisted = await this.repository.existsById(id);
      if (!isExisted) {
        throw new BadRequestException(
          'Feedback type does not found with the provided id'
        );
      }
      const data = await this.repository.findById(id);

      if (data !== undefined) {
        throw new BadRequestException(
          'This feedback type ID is now active. Cannot restore it'
        );
      }
      return this.repository.restoreDisabledById(
        accountId,
        id
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  // async permanentlyDeleteFeedbackTypeById(id: string) {
  //   try {
  //     const isExisted = await this.repository.existsById(id);
  //     if (!isExisted) {
  //       throw new BadRequestException(
  //         'Feedback type does not found with the provided id'
  //       );
  //     }
  //     const data = await this.repository.findById(id);
  //     if (data !== undefined) {
  //       throw new BadRequestException(
  //         'Please delete this type after permanently delete'
  //       );
  //     } else {
  //       return this.repository.permanentlyDeleteById(id);
  //     }
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new BadRequestException(e.message);
  //   }
  // }
}
