import {ValidationPipe, ClassSerializerInterceptor} from '@nestjs/common';
import {NestFactory, Reflector} from '@nestjs/core';
import {Transport} from '@nestjs/microservices';
import {
    NestExpressApplication,
    ExpressAdapter,
} from '@nestjs/platform-express';
import * as compression from 'compression';
import * as RateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import {AppModule} from './app.module';
import {HttpExceptionFilter} from './filters/bad-request.filter';
import {QueryFailedFilter} from './filters/query-failed.filter';
import {ConfigService} from './shared/services/config.service';
import {SharedModule} from './shared/shared.module';
import {setupSwagger} from './viveo-swagger';
import {IoAdapter} from "@nestjs/platform-socket.io";
import * as redisIoAdapter from 'socket.io-redis';

const redisAdapter = redisIoAdapter({host: 'localhost', port: 6379});

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}

async function bootstrap() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        {cors: true},
    );

    app.useWebSocketAdapter(new RedisIoAdapter(app));

    // app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    app.use(helmet());
    app.use(
        new RateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        }),
    );
    app.use(compression());
    app.use(morgan('combined'));

    const reflector = app.get(Reflector);

    app.useGlobalFilters(
        new HttpExceptionFilter(reflector),
        new QueryFailedFilter(reflector),
    );

    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            dismissDefaultMessages: true,
            validationError: {
                target: false,
            },
        }),
    );

    const configService = app.select(SharedModule).get(ConfigService);

    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            port: configService.getNumber('TRANSPORT_PORT'),
            retryAttempts: 5,
            retryDelay: 3000,
        },
    });

    // app.connectMicroservice({
    //     transport: Transport.REDIS,
    //     options: {
    //         url: 'redis://localhost:6379',
    //     },
    // });

    await app.startAllMicroservicesAsync();

    if (['development', 'staging'].includes(configService.nodeEnv)) {
        setupSwagger(app);
    }

    const port = configService.getNumber('PORT');
    await app.listen(port);

    console.info(`server running on port ${port}`);
}

bootstrap();
