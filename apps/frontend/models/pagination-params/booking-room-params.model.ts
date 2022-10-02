export interface BookingRequestParams {
  search: string;
  page?: number;
  limit?: number;
  roomName?: string;
  reasonType?: string;
  checkInAt?: string;
  checkOutAt?: string;
  dir?: string;
  sort?: string;
  status?: string;
}

export const defaultPaginationParams: BookingRequestParams = {
  search: "",
  page: 1,
  limit: 5,
  roomName: '',
  reasonType: '',
  checkInAt: '',
  checkOutAt: '',
  dir: 'ASC',
  sort: 'roomName',
  status: '',
};
