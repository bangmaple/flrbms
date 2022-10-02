import {BasePayload} from "./base.payload";

export interface PaginationPayload<T> extends BasePayload<T> {
  page: number;
  limit: number;
}
