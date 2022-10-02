import {FeedbackService} from '../services';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {FeedbackSendRequestPayload} from '../payload/request/feedback-send.request.payload';
import {Logger} from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/feedback',
})
export class FeedbackGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(FeedbackGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly feedbackService: FeedbackService) {
  }

  handleConnection(client: Socket, ...args: any[]) {
    //this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
   // this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendFeedback')
  async addNewFeedback(
    @MessageBody() feedback: FeedbackSendRequestPayload,
    @ConnectedSocket() client: Socket
  ) {
    const feedbackSent = await this.feedbackService.addNewFeedback(
      client.id,
      feedback
    );

    this.server.emit('feedbackSent', feedbackSent);

    return feedbackSent;
  }

  @SubscribeMessage('sendFeedback')
  async sendFeedback(
    @MessageBody() createdBy: string,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('sendFeedback', createdBy);
    return {
      data: createdBy,
      event: 'sendFeedback',
    };
  }

  @SubscribeMessage('resolveFeedback')
  async resolveFeedback(
    @MessageBody() createdBy: string,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('resolveFeedback', createdBy);
    return {
      data: createdBy,
      event: 'resolveFeedback',
    };
  }

  @SubscribeMessage('rejectFeedback')
  async rejectFeedback(
    @MessageBody() createdBy: string,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit('rejectFeedback', createdBy);
    return {
      data: createdBy,
      event: 'rejectFeedback',
    };
  }
}
