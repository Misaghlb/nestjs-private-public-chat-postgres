'use strict';

import {ApiModelProperty} from '@nestjs/swagger';
import {AbstractDto} from '../../../common/dto/AbstractDto';
import {MessageEntity} from "../message.entity";

export class MessageDto extends AbstractDto {
    @ApiModelProperty()
    text: string;


    constructor(msg: MessageEntity) {
        super(msg);
        this.text = msg.text;
    }
}
