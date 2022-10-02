import {Rooms} from "../models";

export interface RoomSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: Rooms;
    }>;
  };
}
