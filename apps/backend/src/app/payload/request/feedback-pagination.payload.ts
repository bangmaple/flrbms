import {PaginationParams} from '../../dto/pagination.dto';

export class FeedbackPaginationPayload extends PaginationParams {
  status: string;
  type: string;
  fromDate: string;
  toDate: string;
}
