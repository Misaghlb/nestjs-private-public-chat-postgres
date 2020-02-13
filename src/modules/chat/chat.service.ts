import {Injectable} from '@nestjs/common';
import {UserEntity} from "../user/user.entity";
import {UserDto} from "../user/dto/UserDto";
import {TokenPayloadDto} from "../auth/dto/TokenPayloadDto";
import {MessageEntity} from "./message.entity";
import {MessageDto} from "./dto/MessageDto";
import {MessageRepository} from "./message.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "../user/user.repository";
import {CreateMessageDto} from "./dto/createMessageDto";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(MessageRepository)
        public readonly messageRepository: MessageRepository,
        @InjectRepository(UserRepository)
        public readonly userRepository: UserRepository,
    ) {
    }

    async createToken(msg: CreateMessageDto, sender): Promise<string> {
        let created_msg = this.messageRepository.create({...msg});

        created_msg.sender = sender;
        await this.messageRepository.save(created_msg);
        return "sddf"
        // return new TokenPayloadDto({
        //     expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
        //     accessToken: await this.jwtService.signAsync({ id: user.id }),
        // });
    }


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
