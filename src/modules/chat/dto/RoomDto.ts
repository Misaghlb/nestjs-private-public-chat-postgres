'use strict';

import {ApiModelProperty} from '@nestjs/swagger';
import {AbstractDto} from '../../../common/dto/AbstractDto';
import {MessageEntity} from "../message.entity";
import {RoomEntity} from "../room.entity";
import {UserEntity} from "../../user/user.entity";

export class RoomDto extends AbstractDto {
    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    isPrivate: boolean;


    @ApiModelProperty()
    members: UserEntity[];


    @ApiModelProperty()
    messages: MessageEntity[];

    constructor(room: RoomEntity) {
        super(room);
        this.name = room.name;
        this.isPrivate = room.isPrivate;
        this.members = room.members;
        this.messages = room.messages;
    }
}
