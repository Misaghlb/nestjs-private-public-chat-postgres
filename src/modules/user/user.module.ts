import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {UserService} from './user.service';
import {UserController} from './user.controller';
import {AuthModule} from '../auth/auth.module';
import {UserRepository} from './user.repository';
import {ChatModule} from "../chat/chat.module";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => ChatModule),

        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [UserController],
    exports: [UserService, TypeOrmModule],
    providers: [UserService,],
})
export class UserModule {
}
