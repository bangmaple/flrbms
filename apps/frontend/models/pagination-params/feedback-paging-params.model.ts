export interface FeedbackPaginationParams {
  search: string;
  page?: number;
  limit?: number;
  dir?: string;
  sort?: string;
  status?: string;
}

export const defaultPaginationParams: FeedbackPaginationParams = {
  search: "",
  page: 1,
  limit: 5,
  dir: 'ASC',
  sort: 'roomName',
  status: '',
};
