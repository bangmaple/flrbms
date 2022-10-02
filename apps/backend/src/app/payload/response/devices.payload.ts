import {PaginationPayload} from "./pagination.payload";
import {Devices} from "../../models";

export interface DevicesResponsePayload extends PaginationPayload<Devices> {
  data: Devices[];
}
