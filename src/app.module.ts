import './boilerplate.polyfill';

import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {TypeOrmModule} from '@nestjs/typeorm';
import {join} from 'path';

import {ChatModule} from './modules/chat/chat.module';
import {contextMiddleware} from './middlewares';
import {AuthModule} from './modules/auth/auth.module';
import {MathModule} from './modules/math/math.module';
import {UserModule} from './modules/user/user.module';
import {ConfigService} from './shared/services/config.service';
import {SharedModule} from './shared/shared.module';
import {RedisModule} from "nestjs-redis";

@Module({
    imports: [
        AuthModule,
        UserModule,
        MathModule,
        ChatModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'static'),
        }),
        RedisModule.register({url: 'redis://127.0.0.1:6379/0'}),
    ],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
