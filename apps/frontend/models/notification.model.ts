export interface Notification {
  updatedBy: string;
  updatedAt: string;
  createdBy: string;
  createdAt: string;
  deletedAt: string;
  deletedBy: string;
  id?: string;
  title?: string;
  message?: string;
  receiver?: string;
}
