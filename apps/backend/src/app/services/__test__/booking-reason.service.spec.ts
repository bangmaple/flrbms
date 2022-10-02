import {Test} from '@nestjs/testing';
import {BookingReasonService} from '../booking-reason.service';
import {PaginationParams} from '../../dto/pagination.dto';
import {BookingReasonRepository} from '../../repositories/booking-reason.repository';
import {BookingReasonHistService} from '../booking-reason-hist.service';
import {BookingReasonHistRepository} from '../../repositories/booking-reason-hist.repository';
import {BookingReason} from '../../models/booking-reason.entity';
import {Pagination} from 'nestjs-typeorm-paginate';
import {MasterDataAddRequestPayload} from "../../payload/request/master-data-add.request.payload";

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export class MockFactory {
  static getMock<T>(
    type: new (...args: any[]) => T,
    includes?: string[]
  ): MockType<T> {
    const mock: MockType<T> = {};

    Object.getOwnPropertyNames(type.prototype)
      .filter(
        (key: string) =>
          key !== 'constructor' && (!includes || includes.includes(key))
      )
      .map((key: string) => {
        mock[key] = jest.fn();
      });

    return mock;
  }
}

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));
describe('BookingReasonService', () => {
  let service: BookingReasonService;
  let repository: BookingReasonRepository;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        BookingReasonService,
        BookingReasonHistService,
        BookingReasonRepository,
        BookingReasonHistRepository,
      ],
    }).compile();

    service = app.get<BookingReasonService>(BookingReasonService);
    repository = app.get<BookingReasonRepository>(BookingReasonRepository);
  });

  describe('createNewBookingReason', () => {
    const accountId = 'abc';
    const payload: MasterDataAddRequestPayload = {
      name: 'abc',
      description: 'abc',
    };
    it('should create a new booking reason', async () => {
      const expected: MasterDataAddRequestPayload = {
        name: 'abc',
        description: 'abc',
      };
      jest
        .spyOn(repository, 'createNew')
        .mockReturnValueOnce(Promise.resolve(expected));
      const actual = await service.createNewBookingReason(accountId, payload);
      expect(actual).toEqual(expected);
    });
  });

  describe('getAllByPagination', () => {
    const paginationParams: PaginationParams = {
      dir: 'ASC',
      search: '',
      limit: 5,
      page: 1,
      sort: 'name',
    };

    it('should return all booking reasons', async () => {
      const expected = {
        meta: {},
        links: {},
        items: [
          {
            id: '1',
            createdAt: new Date(),
            createdBy: 'abc',
            description: 'abc',
            name: 'abc',
          },
        ],
      } as Pagination<BookingReason>;
      jest
        .spyOn(repository, 'findByPagination')
        .mockReturnValueOnce(Promise.resolve(expected));

      const actual = await service.getAllByPagination(paginationParams);
      expect(actual).toEqual(expected);
    });
  });
});
