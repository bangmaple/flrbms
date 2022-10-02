import {PaginationPayload} from "./pagination.payload";
import {Rooms} from "../../models";

export interface RoomsResponsePayload extends PaginationPayload<Rooms> {
  data: Rooms[];
}
