'use strict';

import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from "class-validator";

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @ApiModelProperty()
    text: string;

    // @IsUUID()
    // @IsNotEmpty()
    // @ApiModelProperty()
    // sender: UserEntity;

    @IsString()
    @IsNotEmpty()
    @ApiModelProperty()
    room_name: string;

    constructor(text, room) {
        this.text = text;
        this.room_name = room;
    }
}
