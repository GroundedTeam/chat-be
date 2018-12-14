import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Message } from "../models/message";
import { ChatRepository } from "../repositories/chat-repository";
import { MessageRepository } from "../repositories/message-repository";
import { UserRepository } from "../repositories/user-repository";

interface CreateMessage {
    text: string;
    senderId: number;
    roomId: number;
}

@Service()
export class MessageService {
    constructor(
        @OrmRepository() private chatRepo: ChatRepository,
        @OrmRepository() private userRepo: UserRepository,
        @OrmRepository() private messageRepo: MessageRepository,
    ) {}

    public async create(createObj: CreateMessage): Promise<Message> {
        const { text, senderId, roomId } = createObj;
        const message = new Message();
        message.chat = await this.chatRepo.findOne(roomId);
        message.sender = await this.userRepo.findOne(senderId);
        message.text = text;
        message.createdAt = new Date();

        return this.messageRepo.save(message);
    }
}
