import { Statistics } from "./statistics.model";

export interface BookingRoomStatistics {
  totalTime: Statistics;
  month: Statistics;
  week: Statistics;
  day: Statistics;
}
