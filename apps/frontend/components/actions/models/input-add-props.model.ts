import { InputTypes } from './input-type.constant';

export interface InputAddProps {
  id: string;
  name: string;
  required: boolean;
  label: string;
  description: string;
  inputtype: string;
  data?: any[];
}
