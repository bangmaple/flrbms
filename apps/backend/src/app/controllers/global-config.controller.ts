import {Body, Controller, Get, Post} from '@nestjs/common';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import {readFileSync} from 'fs';
import {join} from 'path';
import {ApiTags} from '@nestjs/swagger';
import {Roles} from '../decorators';
import {Role} from '../enum';
import dayjs = require('dayjs');
import {Slot} from "../models";

class RoomBookingLimitDate {
  startDate: string;
  endDate: string;
}

const slot = {
  slot1: {
    name: 'Slot 1',
    start: '07:00:00',
    end: '09:15:00'
  },
  slot2: {
    name: 'Slot 2',
    start: '09:45:00',
    end: '12:00:00'
  },
  slot3: {
    name: 'Slot 3',
    start: '12:30:00',
    end: '14:45:00'
  },
  slot4:
    {
      name: 'Slot 4',
      start: '15:15:00',
      end: '17:30:00'
    },
  slot5: {
    name: 'Slot 5',
    start: '18:00:00',
    end: '20:15:00'
  }
}
export const getConfigFileLoaded = () => {
  try {
    return yaml.load(
      readFileSync(join('backend-config.yaml'), 'utf8')
    ) as Record<any, number>;
  } catch (e) {
    fs.writeFileSync(
      './backend-config.yaml',
      yaml.dump({
        maxBookingDateRange: 14,
        maxDeviceBorrowQuantity: 100,
        maxBookingRequestPerWeek: 3,
        maxRoomCapacity: 1000,
        slots: slot
      })
    )
    ;
    return yaml.load(
      readFileSync(join('backend-config.yaml'), 'utf8')
    ) as Record<any, number>;
  }
};

@Controller('/v1/config')
@ApiTags('System Config')
export class GlobalConfigController {
  @Get('room-booking-date-limit')
  getRoomBookingLimitDate(): Promise<RoomBookingLimitDate> {
    return Promise.resolve({
      startDate: dayjs().startOf('hour').format('YYYY-MM-DD'),
      endDate: dayjs()
        .endOf('week')
        .endOf('day')
        .add(getConfigFileLoaded().maxBookingDateRange, 'day')
        .format('YYYY-MM-DD'),
    });
  }

  @Get('max-borrow-devices-quantity')
  getMaxBorrowDevicesQuantity(): Promise<any> {
    return Promise.resolve(getConfigFileLoaded().maxDeviceBorrowQuantity);
  }

  @Get('max-booking-request-per-week')
  getMaxBookingRequestPerWeek(): Promise<any> {
    return Promise.resolve(getConfigFileLoaded().maxBookingRequestPerWeek);
  }

  @Get('max-room-capacity')
  getMaxRoomCapacity(): Promise<any> {
    return Promise.resolve(getConfigFileLoaded().maxRoomCapacity);
  }

  @Get()
  getAllConfig() {
    return Promise.resolve(getConfigFileLoaded());
  }

  @Post()
  updateConfig(
    @Body()
      val: {
      maxBookingDateRange: string;
      maxDeviceBorrowQuantity: string;
      maxBookingRequestPerWeek: string;
      maxRoomCapacity: string;
    }
  ) {
    fs.writeFileSync(
      './backend-config.yaml',
      yaml.dump({
        ...getConfigFileLoaded(),
        maxBookingDateRange: val.maxBookingDateRange
          ? parseInt(val.maxBookingDateRange, 10)
          : 14,
        maxDeviceBorrowQuantity: val.maxDeviceBorrowQuantity
          ? parseInt(val.maxDeviceBorrowQuantity, 10)
          : 100,
        maxBookingRequestPerWeek: val.maxBookingRequestPerWeek
          ? parseInt(val.maxBookingRequestPerWeek, 10)
          : 3,
        maxRoomCapacity: val.maxRoomCapacity
          ? parseInt(val.maxRoomCapacity, 10)
          : 1000
      })
    );
  }

  @Post('max-booking-request-per-week')
  setMaxBookingRequestPerWeek(@Body() val: { number: number }) {
    fs.writeFileSync(
      './backend-config.yaml',
      yaml.dump({
        ...getConfigFileLoaded(),
        maxBookingRequestPerWeek: val.number,
      })
    );
  }

  @Post('max-borrow-devices-quantity')
  setMaxBorrowDevicesQuantity(@Body() val: { number: number }) {
    fs.writeFileSync(
      './backend-config.yaml',
      yaml.dump({
        ...getConfigFileLoaded(),
        maxDeviceBorrowQuantity: val.number,
      })
    );
  }

  @Post('room-booking-date-limit')
  setRoomBookingDateRange(@Body() val: { number: number }) {
    fs.writeFileSync(
      './backend-config.yaml',
      yaml.dump({
        ...getConfigFileLoaded(),
        maxBookingDateRange: val.number,
      })
    );
  }

  @Post('max-room-capacity')
  setMaxRoomCapacity(@Body() val: { number: number }) {
    fs.writeFileSync(
      './backend-config.yaml',
      yaml.dump({
        ...getConfigFileLoaded(),
        maxRoomCapacity: val.number,
      })
    );
  }

  @Get('current-date')
  getCurrentDateTime(): Promise<{date: string}> {
    return Promise.resolve({
      date: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
  }
}
