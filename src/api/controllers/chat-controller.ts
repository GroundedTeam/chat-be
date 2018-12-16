import { Body, Get, JsonController, NotFoundError, Post, QueryParam } from "routing-controllers";
import { Service } from "typedi";
import { EntityFromParam } from "typeorm-routing-controllers-extensions";

import { Chat } from "../models/chat";
import { User } from "../models/user";
import { ChatService } from "../services/chat-service";
import { UserService } from "../services/user-service";

@JsonController("/chats")
export class ChatController {
    constructor(
        @Service() private chatService: ChatService,
        @Service() private userService: UserService,
    ) {
    }

    @Get("")
    public async find(
        @QueryParam("senderId") senderId: number,
        @QueryParam("receiverId") receiverId: number,
    ): Promise<{ data: Chat }> {
        if (!senderId) {
            throw new NotFoundError("Sender was not found!");
        }
        if (!receiverId) {
            throw new NotFoundError("Receiver was not found!");
        }

        return {
            data: await this.chatService.find(senderId, receiverId),
        };
    }

    @Post("")
    public async create(@Body() { senderId, receiverId }: any): Promise<Chat> {
        const [sender, receiver] = await Promise.all([
            this.userService.findById(senderId),
            this.userService.findById(receiverId),
        ]);
        if (!sender) {
            throw new NotFoundError("Sender is not found!");
        }
        if (!receiver) {
            throw new NotFoundError("Receiver is not found!");
        }

        return await this.chatService.create({ sender, receiver });
    }

    @Get("/users/:id")
    public async findByUser(@EntityFromParam("id") user: User): Promise<{ data: Array<Chat> }> {
        if (!user) {
            throw new NotFoundError("User was not found!");
        }

        return {
            data: await this.chatService.findByUser(user),
        };
    }
}
