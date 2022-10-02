import {PaginationDataResponse} from "./pagination-data-response.model";
import {Room} from "./room.model";

export interface RoomsResponsePayload extends PaginationDataResponse {
  data: Room[];
}
