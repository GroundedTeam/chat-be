import { ConnectedSocket, MessageBody, OnConnect, OnDisconnect, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Socket } from "socket.io";
import { Service } from "typedi";

import { User } from "../models/user";
import { MessageService } from "../services/message-service";
import { UserService } from "../services/user-service";

@SocketController()
export class MessageController {
    constructor(
        @Service() private userService: UserService,
        @Service() private messageService: MessageService,
    ) {
    }

    @OnConnect()
    public async connection(@ConnectedSocket() socket: Socket): Promise<void> {
        const { type, username } = socket.handshake.query;

        const user = await this.userService.create(socket.id, type, username);

        (socket as any).user = user;

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
    public async disconnect(@ConnectedSocket() socket: Socket): Promise<void> {
        const user = await this.userService.findBySocketId(socket.id);
        socket.broadcast.emit("user-disconnected", {
            type: "disconnected-user",
            user,
        });
    }

    @OnMessage("message")
    public async save(@ConnectedSocket() socket: Socket, @MessageBody() messageBody: any): Promise<void> {
        const message = await this.messageService.create(messageBody);
        const receiver = await this.userService.findById(messageBody.receiverId);

        let receiverSocket = receiver.socketId;
        if (receiver.type === User.TYPE_USER) {
            receiverSocket = String(message.chat.id);
        }

        socket.to(receiverSocket).emit("new-message", {
            type: "new-message",
            content: {
                text: message.text,
                sender: message.sender,
                time: message.createdAt,
            },
            chatId: message.chatId,
        });
    }

    @OnMessage("join-room")
    public joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() messageBody: any): void {
        socket.join(messageBody.roomId);
    }

    @OnMessage("leave-room")
    public leaveRoom(@ConnectedSocket() socket: Socket, @MessageBody() messageBody: any): void {
        socket.leave(messageBody.roomId);
    }

    @OnMessage("connection-list")
    public connectionList(@ConnectedSocket() socket: Socket, @SocketIO() io: any): void {
        const userIds = [];
        for (const socketId in io.sockets.connected) {
            if (io.sockets.connected.hasOwnProperty(socketId)) {
                userIds.push(io.sockets.connected[socketId].user.id);
            }
        }

        socket.emit("connection-list", { type: "connection-list", content: userIds });
    }
}
