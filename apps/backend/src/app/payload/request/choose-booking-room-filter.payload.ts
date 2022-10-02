interface RoomNameFilter {
  name: string;
  sort: "ASC" | "DESC";
}

interface RoomTypeFilter {
  name: string;
  sort: "ASC" | "DESC";
}

export interface ChooseBookingRoomFilterPayload {
  roomName: RoomNameFilter,
  roomType: RoomTypeFilter,
}
