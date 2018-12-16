import { Get, JsonController } from "routing-controllers";
import { EntityFromParam } from "typeorm-routing-controllers-extensions";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Chat } from "../models/chat";
import { Message } from "../models/message";
import { MessageRepository } from "../repositories/message-repository";

@JsonController("/messages")
export class MessageController {
    constructor(@OrmRepository() private messageRepository: MessageRepository) {}

    @Get("/:id")
    public async find(
        @EntityFromParam("id") chat: Chat,
    ): Promise<Array<Message>> {
        return await this.messageRepository.findByChat(chat);
    }
}
