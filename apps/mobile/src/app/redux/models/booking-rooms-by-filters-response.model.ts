export interface BookingRoomsByFiltersResponse {
  id: string;
  status: string;
  roomName: string;
  roomType: string;
  checkinDate: string;
  slotStart: number;
  slotEnd: number;
  requestedBy: string;
  checkinTime: string;
  checkoutTime: string;
}
