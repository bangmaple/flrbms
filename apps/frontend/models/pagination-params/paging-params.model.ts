export interface PagingParams {
  page?: number;
  limit?: number;
  name?: string;
  search?: string;
  type?: string;
  dir?: string;
  sort?: string;
}

export const defaultPaginationParams: PagingParams = {
  page: 1,
  limit: 5,
  name: '',
  search: '',
  type: '',
  dir: 'ASC',
  sort: 'name',
};
