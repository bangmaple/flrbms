import {PaginationPayload} from "./pagination.payload";
import {Accounts} from "../../models";

export interface AccountsResponsePayload extends PaginationPayload<Accounts> {
  data: Accounts[];
}
