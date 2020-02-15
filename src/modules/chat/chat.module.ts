import {forwardRef, Module} from '@nestjs/common';

import {UserModule} from '../user/user.module';
import {ChatGateway} from './chat.gateway';
import {ChatController} from './chat.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatService} from "./chat.service";
import {MessageRepository} from "./message.repository";
import {RoomRepository} from "./room.repository";
import {AuthModule} from "../auth/auth.module";

@Module({
    providers: [ChatGateway, ChatService],
    imports: [
        TypeOrmModule.forFeature([MessageRepository, RoomRepository]),
        forwardRef(() => UserModule),
        AuthModule,

    ],
    controllers: [ChatController],
    exports: [TypeOrmModule]
})
export class ChatModule {
}
