'use strict';

import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty} from "class-validator";
import {UserEntity} from "../../user/user.entity";

export class CreatePrivateRoomDto {

    @IsNotEmpty()
    @ApiModelProperty()
    sender: UserEntity;


    @IsNotEmpty()
    @ApiModelProperty()
    receiver: UserEntity;

    // @ApiModelProperty()
    // members: UserEntity[];
    //

}
