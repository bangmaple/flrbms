import { BookingRoomService } from '../services';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BookingRoomPaginationParams } from '../dto/booking-room-pagination.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/booking',
})
export class BookingRoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger: Logger = new Logger(BookingRoomGateway.name);

  constructor(private readonly bookingRoomService: BookingRoomService) {}

  handleConnection(client: Socket, ...args: any[]): any {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    //  this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  testMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string
  ): WsResponse<string> {
    client.broadcast.emit('msgToServer', message);
    return {
      data: message,
      event: 'msgToClient',
    };
  }

  @SubscribeMessage('findAllRequests')
  async findAllRequest(
    @MessageBody() pagination: BookingRoomPaginationParams,
    @ConnectedSocket() client: Socket
  ) {
    // const requestSent = await this.bookingRoomService.getAllBookingRoomsPagination(
    //   pagination,
    //   client.id
    // );
    return null;
  }

  @SubscribeMessage('sendRequestForSelf')
  async sendRequestForSelf(
    @MessageBody() bookedFor: string,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('sendRequestForSelf', bookedFor);
    return {
      data: bookedFor,
      event: 'sendRequestForSelf',
    };
  }

  @SubscribeMessage('sendRequestForOther')
  async sendRequestForOther(
    @MessageBody() bookedFor: string,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('sendRequestForOther', bookedFor);
    return {
      data: bookedFor,
      event: 'sendRequestForOther',
    };
  }

  @SubscribeMessage('acceptRequest')
  async acceptRequest(
    @MessageBody() bookedFor: string,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('acceptRequest', bookedFor);
    return {
      data: bookedFor,
      event: 'acceptRequest',
    };
  }

  @SubscribeMessage('cancelRequest')
  async cancelRequest(
    @MessageBody() payload: { cancelledBy: string; bookedFor: string },
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('cancelRequest', payload);
    return {
      data: payload,
      event: 'cancelRequest',
    };
  }

  @SubscribeMessage('rejectRequest')
  async rejectRequest(
    @MessageBody() bookedFor: string,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('rejectRequest', bookedFor);
    return {
      data: bookedFor,
      event: 'rejectRequest',
    };
  }

  @SubscribeMessage('updateDevicesForOthers')
  async updateDevicesForOthers(
    @MessageBody() bookedFor: string,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('updateDevicesForOthers', bookedFor);
    return {
      data: bookedFor,
      event: 'updateDevicesForOthers',
    };
  }
}
