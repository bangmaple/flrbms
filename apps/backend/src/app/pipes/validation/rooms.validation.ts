import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import {RoomsRequestPayload} from "../../payload/request/rooms.payload";
import {validate} from "class-validator";
import {plainToClass} from "class-transformer";

@Injectable()
export class RoomsValidation implements PipeTransform<any> {


  async transform(value: RoomsRequestPayload, {metatype}: ArgumentMetadata): Promise<RoomsRequestPayload> {
    if (!metatype || !this.validateMetaType(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException(Object.values(errors[0].constraints)[0]);
    }

    return value;

  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private validateMetaType(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
