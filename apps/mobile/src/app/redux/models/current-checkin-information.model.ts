interface Device {
  id: string;
  deviceName: string;
  bookingRequestId: string;
  deviceId: string;
  deviceQuantity: number;
}

export interface CurrentCheckinInformation {
  id: string;
  description: string;
  username: string;
  bookingReason: string;
  roomId: string;
  roomName: string;
  requestedBy: string;
  requestedAt: string;
  checkinSlot: number;
  checkoutSlot: number;
  checkinTime: string;
  checkoutTime: string;
  acceptedAt: string;
  checkinDate: string;
  checkoutDate: string;
  devices: Device[];
}
