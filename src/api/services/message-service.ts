import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Message } from "../models/message";
import { ChatRepository } from "../repositories/chat-repository";
import { MessageRepository } from "../repositories/message-repository";
import { UserRepository } from "../repositories/user-repository";

@Service()
export class MessageService {
    constructor(
        @OrmRepository() private chatRepo: ChatRepository,
        @OrmRepository() private userRepo: UserRepository,
        @OrmRepository() private messageRepo: MessageRepository,
    ) {
    }

    public async create({ text, senderId, roomId }: any): Promise<Message> {
        const message = new Message();

        const [chat, sender] = await Promise
            .all([
                this.chatRepo.findOne(roomId),
                this.userRepo.findOne(senderId),
            ]);
        message.chat = chat;
        message.sender = sender;
        message.text = text;

        return this.messageRepo.save(message);
    }
}
