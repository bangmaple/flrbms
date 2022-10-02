export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  dir?: string;
  sort?: string;
}

export const defaultPaginationParams: PaginationParams = {
  page: 1,
  limit: 5,
  search: '',
  dir: 'ASC',
  sort: 'name',
};
