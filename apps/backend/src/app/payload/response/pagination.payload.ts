import {BasePayload} from "./base.payload";

export interface PaginationPayload<T> extends BasePayload<T> {
  totalPage: number;
  currentPage: number;
  size: number;
};
