import {forwardRef, Module} from '@nestjs/common';

import {UserModule} from '../user/user.module';
import {ChatGateway} from './chat.gateway';
import {ChatController} from './chat.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatService} from "./chat.service";
import {MessageRepository} from "./message.repository";

@Module({
    providers: [ChatGateway, ChatService],
    imports: [forwardRef(() => UserModule),
        TypeOrmModule.forFeature([MessageRepository]),

    ],
    controllers: [ChatController],
    exports: [TypeOrmModule]
})
export class ChatModule {
}
