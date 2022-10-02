export interface Room {
  isTypeDeleted: string;
  stt: number;
  id: string;
  name: string;
  roomTypeId: string,
  roomTypeName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDisabled: boolean;
  isDeleted: boolean;
  createdBy: string;
  updatedBy: string;
  disabledAt: string;
  deletedAt: string;
  disabledBy: string;
  deletedBy: string;
  capacity: number;
}
