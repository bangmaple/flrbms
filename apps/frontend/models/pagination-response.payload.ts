import { PaginationMeta } from './pagination-meta.model';

export interface PaginationResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
