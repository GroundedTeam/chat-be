import { EntityRepository, Repository } from "typeorm";

import { Chat } from "../models/chat";
import { Message } from "../models/message";

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
    public async findByChat(chat: Chat): Promise<Array<Message>> {
        return this.createQueryBuilder("m")
            .innerJoin("m.chat", "c")
            .where("c.id = :chatId", { chatId: chat.id })
            .getMany();
    }
}
