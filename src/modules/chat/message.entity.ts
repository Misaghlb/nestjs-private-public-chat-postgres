import {Column, Entity, ManyToOne} from 'typeorm';

import {AbstractEntity} from '../../common/abstract.entity';
import {MessageDto} from "./dto/MessageDto";
import {UserEntity} from "../user/user.entity";

@Entity({name: 'messages'})
export class MessageEntity extends AbstractEntity<MessageDto> {
    @Column({nullable: true})
    text: string;

    // @ManyToOne(type => UserEntity, {cascade: ['insert', 'update']})
    // @ManyToOne(type => UserEntity,)
    // owner: UserEntity;

    @ManyToOne(type => UserEntity, message => message.sent_messages)
    sender: UserEntity;

    @ManyToOne(type => UserEntity, message => message.received_messages)
    receiver: UserEntity;

    dtoClass = MessageDto;
}
