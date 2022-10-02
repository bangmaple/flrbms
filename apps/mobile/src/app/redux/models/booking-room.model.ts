export interface BookingRoom {
  id: string;
  status: string;
  description: string;
  roomId: string;
  roomName: string;
  roomDescription: string;
  requestedBy: string;
  updatedBy: string;
  checkinSlot: string;
  checkoutSlot: string;
  reason: string;
  checkinDate: string;
  checkoutDate: string;
  checkinTime: string;
  checkoutTime: string;
  reasonType: string;
  checkinAt: string;
  checkoutAt: string;
  requestedAt: string;
  requestedById: string;
}
