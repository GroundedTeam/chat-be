import {
    ConnectedSocket,
    MessageBody,
    OnConnect,
    OnDisconnect,
    OnMessage,
    SocketController,
} from "socket-controllers";
import { Service } from "typedi";

import { MessageService } from "../services/message-service";
import { UserService } from "../services/user-service";

@SocketController()
export class MessageController {
    constructor(
        @Service() private userService: UserService,
        @Service() private messageService: MessageService,
    ) {}

    @OnConnect()
    public async connection(@ConnectedSocket() socket: any): Promise<any> {
        const user = await this.userService.create(socket.id);
        socket.emit("register", {
            type: "user",
            user,
        });

        socket.broadcast.emit("new-user-connected", {
            type: "connected-user",
            user,
        });
    }

    @OnDisconnect()
    public async disconnect(@ConnectedSocket() socket: any): Promise<any> {
        const user = await this.userService.findBySocketId(socket.id);
        await this.userService.updateStatus(user, 0);
        socket.broadcast.emit("user-disconnected", {
            type: "disconnected-user",
            user,
        });
    }

    @OnMessage("message")
    public async save(
        @ConnectedSocket() socket: any,
        @MessageBody() messageBody: any,
    ): Promise<any> {
        const message = await this.messageService.create(messageBody);

        socket.to(message.chat.id).emit("new-message", {
            type: "new-message",
            content: {
                text: message.text,
                sender: message.sender,
                time: message.createdAt,
            },
        });
    }

    @OnMessage("join-room")
    public joinRoom(
        @ConnectedSocket() socket: any,
        @MessageBody() messageBody: any,
    ): any {
        socket.join(messageBody.roomId);
    }

    @OnMessage("leave-room")
    public leaveRoom(
        @ConnectedSocket() socket: any,
        @MessageBody() messageBody: any,
    ): any {
        socket.leave(messageBody.roomId);
    }
}
