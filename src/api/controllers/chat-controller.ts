import { Response } from "express";
import { Body, Get, JsonController, NotFoundError, Post, QueryParam, Res } from "routing-controllers";
import { Service } from "typedi";

import { Chat } from "../models/chat";
import { ChatService } from "../services/chat-service";
import { UserService } from "../services/user-service";

@JsonController("/chats")
export class ChatController {
    constructor(
        @Service() private chatService: ChatService,
        @Service() private userService: UserService,
    ) {}

    @Get("")
    public async find(
        @QueryParam("senderId") senderId: number,
        @QueryParam("receiverId") receiverId: number,
        @Res() response: Response,
    ): Promise<Chat | Response> {
        if (!senderId) {
            throw new NotFoundError("Sender was not found!");
        }
        if (!receiverId) {
            throw new NotFoundError("Receiver was not found!");
        }
        const chat = await this.chatService.find(senderId, receiverId);
        if (chat === undefined) {
            return response.status(204).send("Nothing was found");
        }

        return chat;
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
}
