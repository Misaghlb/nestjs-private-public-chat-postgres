import {Repository} from 'typeorm';
import {EntityRepository} from 'typeorm/decorator/EntityRepository';
import {MessageEntity} from "./message.entity";

@EntityRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {
}
