import {Logger, OnModuleInit, UnauthorizedException,} from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import * as socketioJwt from 'socketio-jwt';

import {UserService} from '../user/user.service';
import {ConfigService} from '../../shared/services/config.service';
import {AuthUser} from "../../decorators/auth-user.decorator";
import {UserEntity} from "../user/user.entity";``
import {ChatService} from "./chat.service";
import {CreateMessageDto} from "./dto/createMessageDto";
import {Client, ClientProxy, Transport} from "@nestjs/microservices";
import {RedisService} from "nestjs-redis";

// import {JwtGuard} from "../auth/wsjwt.guard";

@WebSocketGateway()
export class ChatGateway
    implements OnGatewayInit,
        OnGatewayConnection,
        OnGatewayDisconnect,
        OnModuleInit {
    constructor(
        public readonly configService: ConfigService,
        public readonly userService: UserService,
        private _chatService: ChatService,
        private readonly redisService: RedisService,
    ) {
    }

    // @Client({
    //     transport: Transport.REDIS, options: {
    //         url: 'redis://localhost:6379',
    //     }
    // })
    // redisClient: ClientProxy;


    @WebSocketServer()
    server: Server;

    onModuleInit() {
        (<any>this.server).set(
            'authorization',
            socketioJwt.authorize({
                secret: this.configService.get('JWT_SECRET_KEY'),
                handshake: true,
            }),
        );
    }

    private logger: Logger = new Logger('AppGateway');

    // @UseGuards(WsAuthGuard)
    @SubscribeMessage('msgToServer')
    async handleMessage(client: Socket, payload: CreateMessageDto) {
        // const {user, ...result} = payload;
        // console.log(client.request.user);
        await this._chatService.createToken(payload, client.request.user);
        // this.logger.log(payload, 'msgToServer');
        const ans = {"name": client.request.user.email, "text": payload.text};
        // console.log(this.server.clients().sockets);
        // const tt = await this.redisService.getClient().get(`users:${client.request.user.id}`);
        const tt = await this.redisService.getClient().get(`users:${payload.receiver}`);
        console.log(tt);
        if (tt) {
            // this.server.emit('msgToClient', ans);
            this.server.to(tt).emit('msgToClient', ans);
        }
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    async handleDisconnect(client: Socket) {
        await this.redisService.getClient().del(`users:${client.request.user.id}`);
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    // @UseGuards(WsGuard)
    // @UseGuards(AuthGuard('jwt'))
    // @UseGuards(WsAuthGuard)
    async handleConnection(client: Socket, ...args: any[]) {
        // let auth_token = client.handshake.headers.authorization;
        // // get the token itself without "Bearer"
        // auth_token = auth_token.split(' ')[1];
        const {iat, exp, id: userId} = client.request.decoded_token;

        const timeDiff = exp - iat;
        if (timeDiff <= 0) {
            throw new UnauthorizedException();
        }
        const user = await this.userService.findOne(userId);

        if (!user) {
            throw new UnauthorizedException();
        }
        client.request.user = user;
        await this.redisService.getClient().set(`users:${client.request.user.id}`, client.id, 'NX', 'EX', 30);

        this.logger.log(`Client connected: ${client.id}`);
    }

    // @SubscribeMessage('message')
    // handleMessage(client: any, payload: any): string {
    //     console.log(client);
    //     console.log(payload);
    //     return 'Hello world!';
    // }
    //
    // // better for testing
    // @SubscribeMessage('events')
    // handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    //     client.emit('res', data);
    //     // return data;
    // }
    //
    // @SubscribeMessage('events')
    // handlePM(@MessageBody() data: unknown): WsResponse<unknown> {
    //     // client.emit('res', data);
    //     const event = 'PM';
    //     return {event, data}
    //
    //     // return data;
    // }
}
