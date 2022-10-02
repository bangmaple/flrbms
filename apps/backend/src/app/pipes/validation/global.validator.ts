import {IsNumberOptions} from "class-validator/types/decorator/typechecker/IsNumber";

export const validationConfig = {
  number: {
    allowNaN: false,
    allowInfinity: false
  } as IsNumberOptions,
};
