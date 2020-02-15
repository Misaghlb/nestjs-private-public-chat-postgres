'use strict';

import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors,} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {ChatService} from './chat.service';
import {CreateMessageDto} from "./dto/createMessageDto";
import {AuthUserInterceptor} from "../../interceptors/auth-user-interceptor.service";
import {AuthGuard} from "../../guards/auth.guard";
import {RolesGuard} from "../../guards/roles.guard";
import {AuthUser} from "../../decorators/auth-user.decorator";
import {UserEntity} from "../user/user.entity";
import {UserDto} from "../user/dto/UserDto";

@Controller('chat')
@ApiUseTags('chat')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class ChatController {
    constructor(private _chatService: ChatService) {}



    // @Post('new_msg')
    // @HttpCode(HttpStatus.OK)
    // // @ApiOkResponse({ type: MessageDto, description: 'Successfully Registered' })
    // async createMessage(@AuthUser() user: UserEntity,
    //     @Body() messageDto: CreateMessageDto,
    // ): Promise<UserDto> {
    //
    //     console.log(user);
    //     const createdUser = await this._chatService.createMessage(
    //         messageDto, user
    //     );
    //
    //     return user.toDto();
    // }

    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4YmFjMjBhLWQxMDMtNDM5Yi1iZWEwLWYwZjMxMjlkZDJhZCIsImlhdCI6MTU4MTUxMDcyM30.B8MYG1VeGW9yNCDrlqSe9dLrkARNlhAzL42qAeoUzvU
    /*
    * {
  "text": "string",
"sender":"c8bac20a-d103-439b-bea0-f0f3129dd2ad",
"receiver":"abe95179-2ffb-4fd4-bbfa-e69e08e4e450"

}
    * */

    // @Get('admin')
    // @Roles(RoleType.USER)
    // @HttpCode(HttpStatus.OK)
    // async admin(@AuthUser() user: UserEntity) {
    //     return 'only for you admin: ' + user.firstName;
    // }
    //
    // @Get('users')
    // @Roles(RoleType.ADMIN)
    // @HttpCode(HttpStatus.OK)
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     description: 'Get users list',
    //     type: UsersPageDto,
    // })
    // getUsers(
    //     @Query(new ValidationPipe({ transform: true }))
    //     pageOptionsDto: UsersPageOptionsDto,
    // ): Promise<UsersPageDto> {
    //     return this._userService.getUsers(pageOptionsDto);
    // }
}
