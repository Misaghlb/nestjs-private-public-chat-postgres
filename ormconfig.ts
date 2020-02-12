import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from './src/snake-naming.strategy';
import './src/boilerplate.polyfill';

if (!(<any>module).hot /* for webpack HMR */) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
}

dotenv.config({
    path: `.${process.env.NODE_ENV}.env`,
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(process.env)) {
    process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

module.exports = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [
        'src/modules/**/*.entity{.ts,.js}',
    ],
    migrations: [
        'src/migrations/*{.ts,.js}',
    ],
};
