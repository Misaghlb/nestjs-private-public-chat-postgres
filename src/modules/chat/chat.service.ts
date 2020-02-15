import {Injectable} from '@nestjs/common';
import {MessageRepository} from "./message.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "../user/user.repository";
import {CreateMessageDto} from "./dto/createMessageDto";
import {RoomRepository} from "./room.repository";
import {MessageEntity} from "./message.entity";
import {UserEntity} from "../user/user.entity";
import {RoomEntity} from "./room.entity";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(MessageRepository)
        public readonly messageRepository: MessageRepository,
        @InjectRepository(UserRepository)
        public readonly userRepository: UserRepository,
        @InjectRepository(RoomRepository)
        public readonly roomRepository: RoomRepository,
    ) {
    }

    // deprecated
    // async createMessage(msg: CreateMessageDto, sender): Promise<MessageEntity> {
    //     let created_msg = this.messageRepository.create(msg);
    //     created_msg.sender = sender;
    //     return this.messageRepository.save(created_msg);
    //
    // }

    /*
    * check room if not exists create it, and save the message in room.
    */
    async createPrivateMessage(sender: UserEntity, receiver: UserEntity, msg: string): Promise<MessageEntity> {
        let room = await this.roomRepository.checkPrivateRoomExists(sender, receiver);
        if (!room) {
            room = await this.roomRepository.createPrivateRoom(sender, receiver)
        }
        return this.messageRepository.save({text: msg, room: room, sender: sender});
    }

    /*
    * check if user is joined the room before, if yes then save the message in room.
    */
    async createPublicRoomMessage(sender: UserEntity, room: RoomEntity, msg: string): Promise<MessageEntity> {
        let alreadyInRoom = room.members.some(ele => ele.id === sender.id);

        if (!alreadyInRoom) {
            return;
        }
        return this.messageRepository.save({text: msg, room: room, sender: sender});
    }

    // async createRoom(data: CreateRoomDto, sender): Promise<RoomDto> {
    //     const createdRoom = await this.roomRepository.createPublicRoom(data, sender);
    //     return createdRoom.toDto()
    // }


    // async createPrivateRoom(data: CreatePrivateRoomDto): Promise<RoomDto> {
    //     const createdRoom = await this.roomRepository.createPrivateRoom(data.sender, data.receiver);
    //     return createdRoom.toDto()
    // }

    // async joinRoom(room: RoomEntity, user: UserEntity): Promise<boolean> {
    //     return await this.roomRepository.join(room, user);
    // }


    // /**
    //  * Find single user
    //  */
    // findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
    //     return this.userRepository.findOne(findData);
    // }
    // async findByUsernameOrEmail(
    //     options: Partial<{ username: string; email: string }>,
    // ): Promise<UserEntity | undefined> {
    //     const queryBuilder = this.userRepository.createQueryBuilder('user');
    //
    //     if (options.email) {
    //         queryBuilder.orWhere('user.email = :email', {
    //             email: options.email,
    //         });
    //     }
    //     if (options.username) {
    //         queryBuilder.orWhere('user.username = :username', {
    //             username: options.username,
    //         });
    //     }
    //
    //     return queryBuilder.getOne();
    // }
    //
    // async createUser(
    //     userRegisterDto: UserRegisterDto,
    // ): Promise<UserEntity> {
    //     const user = this.userRepository.create({ ...userRegisterDto });
    //     return this.userRepository.save(user);
    // }
    //
    // async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<UsersPageDto> {
    //     const queryBuilder = this.userRepository.createQueryBuilder('user');
    //     const [users, usersCount] = await queryBuilder
    //         .skip(pageOptionsDto.skip)
    //         .take(pageOptionsDto.take)
    //         .getManyAndCount();
    //
    //     const pageMetaDto = new PageMetaDto({
    //         pageOptionsDto,
    //         itemCount: usersCount,
    //     });
    //     return new UsersPageDto(users.toDtos(), pageMetaDto);
    // }
}
