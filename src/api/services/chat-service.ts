import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Chat } from "../models/chat";
import { User } from "../models/user";
import { ChatRepository } from "../repositories/chat-repository";

@Service()
export class ChatService {
    constructor(@OrmRepository() private chatRepository: ChatRepository) {
    }

    public async find(senderId: number, receiverId: number): Promise<Chat> {
        return this.chatRepository.findChatByUsers([senderId, receiverId], Chat.CHAT_TYPE_PRIVATE);
    }

    public async create({ sender, receiver }: { sender: User, receiver: User }): Promise<Chat> {
        const chat = new Chat();
        chat.users = [sender, receiver];
        chat.type = Chat.CHAT_TYPE_PRIVATE;

        return this.chatRepository.save(chat);
    }

    public async findByUser(user: User): Promise<Array<Chat>> {
        return this.chatRepository.findByUser(user.id);
    }
}
