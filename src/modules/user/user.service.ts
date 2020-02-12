import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UserRepository } from './user.repository';
import { ValidatorService } from '../../shared/services/validator.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
import { PageMetaDto } from '../../common/dto/PageMetaDto';
import { UsersPageDto } from './dto/UsersPageDto';
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        public readonly userRepository: UserRepository,
    ) {}

    /**
     * Find single user
     */
    findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOne(findData);
    }
    async findByUsernameOrEmail(
        options: Partial<{ username: string; email: string }>,
    ): Promise<UserEntity | undefined> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (options.email) {
            queryBuilder.orWhere('user.email = :email', {
                email: options.email,
            });
        }
        if (options.username) {
            queryBuilder.orWhere('user.username = :username', {
                username: options.username,
            });
        }

        return queryBuilder.getOne();
    }

    async createUser(
        userRegisterDto: UserRegisterDto,
    ): Promise<UserEntity> {
        const user = this.userRepository.create({ ...userRegisterDto });
        return this.userRepository.save(user);
    }

    async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<UsersPageDto> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        const [users, usersCount] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount: usersCount,
        });
        return new UsersPageDto(users.toDtos(), pageMetaDto);
    }
}
