'use strict';

import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from "class-validator";

export class CreateRoomDto {

    @IsString()
    @IsNotEmpty()
    @ApiModelProperty()
    name: string;

}
