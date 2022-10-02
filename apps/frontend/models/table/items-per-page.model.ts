import {SelectItem} from "@mantine/core";

export interface ItemsPerPageModel {
  value: string;
  label: string;
}

export const ItemsPerPageData: ItemsPerPageModel[] | (string | SelectItem)[] = [
  { value: '1', label: '1' },
  { value: '3', label: '3' },
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '30', label: '30' },
  { value: '50', label: '50' },
];
