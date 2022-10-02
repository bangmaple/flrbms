import {BadRequestException} from "@nestjs/common";

export const ContainsMany = <Domain extends string, Domains extends Domain[]>(domains: [...Domains], options?: { message: string }) =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  (target: Object, propertyKey: string) => {
    let value: string;
    const getter = () => value
    const setter = function (newVal: Domain) {
      if (domains.includes(newVal)) {
        value = newVal;
      } else {
        if (!options) {
          throw new BadRequestException(`Must be one of ${domains.join()}`);
        }
        throw new BadRequestException(options.message);
      }
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    });
  };
