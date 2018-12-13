import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Chat } from "../models/chat";
import { User } from "../models/user";
import { ChatRepository } from "../repositories/chat-repository";

@Service()
export class ChatService {
    private type: string;
    constructor(@OrmRepository() private chatRepo: ChatRepository) {
        this.type = "private";
    }

    public async find(senderId: number, receiverId: number): Promise<Chat> {
        return this.chatRepo.findChatByUsers([senderId, receiverId], this.type);
    }

    public async create({
        sender,
        receiver,
    }: {
        sender: User;
        receiver: User;
    }): Promise<Chat> {
        const chat = new Chat();
        chat.users = [sender, receiver];
        chat.type = this.type;

        return this.chatRepo.save(chat);
    }
}
