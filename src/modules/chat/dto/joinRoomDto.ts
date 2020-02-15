'use strict';

import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from "class-validator";

export class JoinRoomDto {

    @IsString()
    @IsNotEmpty()
    @ApiModelProperty()
    name: string;

}
