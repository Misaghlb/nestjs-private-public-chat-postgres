'use strict';

import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, IsUUID} from "class-validator";
import {RoomEntity} from "../room.entity";

export class CreatePrivateMessageDto {
    @IsString()
    @IsNotEmpty()
    @ApiModelProperty()
    text: string;

    @IsUUID()
    @ApiModelProperty()
    receiver: string;

    @IsUUID()
    @ApiModelProperty()
    room: string;

    constructor(text, room) {
        this.text = text;
        this.room = room;
    }
}
