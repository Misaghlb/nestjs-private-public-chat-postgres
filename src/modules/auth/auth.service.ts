import {JwtService} from '@nestjs/jwt';
import {Injectable, UnauthorizedException} from '@nestjs/common';

import {ConfigService} from '../../shared/services/config.service';
import {UserEntity} from '../user/user.entity';
import {UserLoginDto} from './dto/UserLoginDto';
import {UserNotFoundException} from '../../exceptions/user-not-found.exception';
import {UtilsService} from '../../providers/utils.service';
import {UserService} from '../user/user.service';
import {UserDto} from '../user/dto/UserDto';
import {ContextService} from '../../providers/context.service';
import {TokenPayloadDto} from './dto/TokenPayloadDto';
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "../user/user.repository";
import {Socket} from "socket.io";

@Injectable()
export class AuthService {
    private static _authUserKey = 'user_key';

    constructor(
        public readonly jwtService: JwtService,
        public readonly configService: ConfigService,
        public readonly userService: UserService,
        @InjectRepository(UserRepository)
        public readonly userRepository: UserRepository,
    ) {
    }

    async createToken(user: UserEntity | UserDto): Promise<TokenPayloadDto> {
        return new TokenPayloadDto({
            expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this.jwtService.signAsync({id: user.id}),
        });
    }

    async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
        const user = await this.userService.findOne({
            email: userLoginDto.email,
        });
        const isPasswordValid = await UtilsService.validateHash(
            userLoginDto.password,
            user && user.password,
        );
        if (!user || !isPasswordValid) {
            throw new UserNotFoundException();
        }
        return user;
    }

    static setAuthUser(user: UserEntity) {
        ContextService.set(AuthService._authUserKey, user);
    }

    static getAuthUser(): UserEntity {
        return ContextService.get(AuthService._authUserKey);
    }

    /*
    * login user on socket, set user on client request
    * */
    async loginSocket(client: Socket): Promise<UserEntity> {
        const {iat, exp, id: userId} = client.request.decoded_token;

        const timeDiff = exp - iat;
        if (timeDiff <= 0) {
            throw new UnauthorizedException();
            // return false;
        }
        const user = await this.userRepository.findOne(userId, {relations: ['rooms']});

        if (!user) {
            throw new UnauthorizedException();
            // return false;
        }

        // set user on client request for another handlers to get authenticated user.
        client.request.user = user;
        return user
    }
}
