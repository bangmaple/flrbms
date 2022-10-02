export interface NewRequestBookingResponseModel {
  roomId: string,
  requestedBy: string,
  requestedAt: string,
  status: string,
  bookingReasonId: string,
  description: string,
  checkinSlot: string,
  checkoutSlot: string,
  checkinDate: string,
  id: string,
  cancelledAt: string,
  updatedAt: string,
  acceptedAt: string
}
