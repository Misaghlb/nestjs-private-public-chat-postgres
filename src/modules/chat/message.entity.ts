import {Column, Entity, ManyToOne} from 'typeorm';

import {AbstractEntity} from '../../common/abstract.entity';
import {MessageDto} from "./dto/MessageDto";
import {UserEntity} from "../user/user.entity";
import {RoomEntity} from "./room.entity";

@Entity({name: 'messages'})
export class MessageEntity extends AbstractEntity<MessageDto> {
    @Column({nullable: true})
    text: string;

    // @ManyToOne(type => UserEntity, {cascade: ['insert', 'update']})
    // @ManyToOne(type => UserEntity,)
    // owner: UserEntity;

    @ManyToOne(type => UserEntity,)
    sender: UserEntity;

    // @ManyToOne(type => UserEntity, user => user.received_messages, {nullable: true})
    // receiver: UserEntity;

    @ManyToOne(type => RoomEntity, room => room.messages)
    room: RoomEntity;

    // @ManyToOne(type => UserEntity, message => message.received_messages)
    // group: UserEntity;

    // @Column({default: true})
    // isPrivate: boolean;


    dtoClass = MessageDto;
}
