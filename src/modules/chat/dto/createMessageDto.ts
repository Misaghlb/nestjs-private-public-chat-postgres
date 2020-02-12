'use strict';

import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString,IsUUID} from "class-validator";
import {UserEntity} from "../../user/user.entity";

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @ApiModelProperty()
    text: string;

    // @IsUUID()
    // @IsNotEmpty()
    // @ApiModelProperty()
    // sender: UserEntity;

    @IsUUID()
    @IsNotEmpty()
    @ApiModelProperty()
    receiver: UserEntity;

}
