import {QueryRunner, Repository} from 'typeorm';
import {BookingRequestDevices, Devices} from '../models';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';

@CustomRepository(BookingRequestDevices)
export class BookingRoomDevicesRepository extends Repository<BookingRequestDevices> {
  async findByRequestId(id: string): Promise<BookingRequestDevices[]> {
    return this.createQueryBuilder('brd')
      .select('brd.id', 'id')
      .addSelect('brd.booking_request_id', 'bookingRequestId')
      .addSelect('brd.device_id', 'deviceId')
      .addSelect('brd.device_quantity', 'deviceQuantity')
      .addSelect('d.name', 'deviceName')
      .innerJoin(Devices, 'd', 'd.id = brd.device_id')
      .where('brd.booking_request_id = :id', {id: id})
      .getRawMany<BookingRequestDevices>();
  }

  async addDeviceToRequest(
    bookingRequestId: string,
    deviceId: string,
    quantity: number,
    queryRunner: QueryRunner
  ) {
    return await queryRunner.manager.save(BookingRequestDevices, {
      bookingRequestId: bookingRequestId,
      deviceId: deviceId,
      deviceQuantity: quantity,
    });
  }

  async removeDeviceFromRequest(
    bookingRequestId: string,
    queryRunner: QueryRunner
  ) {
    return await queryRunner.manager.delete(BookingRequestDevices, {
      bookingRequestId
    });
  }
}
