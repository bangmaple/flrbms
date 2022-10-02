export interface BookingRoomsByFilters {
  roomName?: string;
  status?: string[];
  dateEnd?: string;
  dateStart?: string;
  checkinTime?: string;
  checkoutTime?: string;
}
