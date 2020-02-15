import {Column, Entity, ManyToMany, OneToMany} from 'typeorm';

import {AbstractEntity} from '../../common/abstract.entity';
import {RoleType} from '../../common/constants/role-type';
import {UserDto} from './dto/UserDto';
import {PasswordTransformer} from './password.transformer';
import {MessageEntity} from "../chat/message.entity";
import {RoomEntity} from "../chat/room.entity";

@Entity({name: 'users'})
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column({type: 'enum', enum: RoleType, default: RoleType.USER})
    role: RoleType;

    @Column({unique: true, nullable: true})
    email: string;

    @Column({nullable: true, transformer: new PasswordTransformer()})
    password: string;

    @Column({nullable: true})
    phone: string;


    //rooms that the user is joined
    @ManyToMany(type => RoomEntity, room => room.members)
    rooms: RoomEntity[];


    // @OneToMany(type => MessageEntity, message => message.receiver)
    // received_messages: MessageEntity[];

    dtoClass = UserDto;
}
