import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Message } from "../models/message";
import { ChatRepository } from "../repositories/chat-repository";
import { MessageRepository } from "../repositories/message-repository";
import { UserRepository } from "../repositories/user-repository";

@Service()
export class MessageService {
    constructor(
        @OrmRepository() private chatRepository: ChatRepository,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private messageRepository: MessageRepository,
    ) {
    }

    public async create({ text, senderId, roomId }: any): Promise<Message> {
        const message = new Message();

        const [chat, sender] = await Promise
            .all([
                this.chatRepository.findOne(roomId),
                this.userRepository.findOne(senderId),
            ]);
        message.chat = chat;
        message.sender = sender;
        message.text = text;

        return this.messageRepository.save(message);
    }
}
