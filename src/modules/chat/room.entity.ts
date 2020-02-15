import {Column, Entity, JoinTable, ManyToMany, OneToMany} from 'typeorm';

import {AbstractEntity} from '../../common/abstract.entity';
import {UserEntity} from "../user/user.entity";
import {MessageEntity} from "./message.entity";
import {RoomDto} from "./dto/RoomDto";

@Entity({name: 'rooms'})
export class RoomEntity extends AbstractEntity<RoomDto> {
    @Column({nullable: false})
    name: string;

    // @ManyToOne(type => UserEntity, {cascade: ['insert', 'update']})
    // @ManyToOne(type => UserEntity,)
    // owner: UserEntity;

    @ManyToMany(type => UserEntity, user => user.rooms, {cascade: true})
    @JoinTable()
    members: UserEntity[];

    @OneToMany(type => MessageEntity, message => message.room)
    messages: MessageEntity[];

    // @ManyToOne(type => UserEntity, message => message.received_messages)
    // group: UserEntity;

    @Column({default: true})
    isPrivate: boolean;


    dtoClass = RoomDto;
}
