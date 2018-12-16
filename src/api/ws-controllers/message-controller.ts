import { ConnectedSocket, MessageBody, OnConnect, OnDisconnect, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Service } from "typedi";

import { Socket } from "socket.io";
import { MessageService } from "../services/message-service";
import { UserService } from "../services/user-service";
import { User } from "../models/user";

@SocketController()
export class MessageController {
    constructor(
        @Service() private userService: UserService,
        @Service() private messageService: MessageService,
    ) {
    }

    @OnConnect()
    public async connection(@ConnectedSocket() socket: Socket): Promise<any> {
        const type = socket.handshake.query.type;
        const username = socket.handshake.query.name;

        const user = await this.userService.create(socket.id, type, username);

        console.log(user);
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
    public async disconnect(@ConnectedSocket() socket: any): Promise<any> {
        const user = await this.userService.findBySocketId(socket.id);
        socket.broadcast.emit("user-disconnected", {
            type: "disconnected-user",
            user,
        });
    }

    @OnMessage("message")
    public async save(@ConnectedSocket() socket: any, @MessageBody() messageBody: any): Promise<any> {
        let receiverSocket;
        const message = await this.messageService.create(messageBody);
        const receiver = await this.userService.findById(messageBody.receiverId);

        if (receiver.type === User.TYPE_USER) {
            receiverSocket = message.chat.id;
        } else {
            receiverSocket = receiver.socketId;
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
    public joinRoom(@ConnectedSocket() socket: any, @MessageBody() messageBody: any): any {
        socket.join(messageBody.roomId);
    }

    @OnMessage("leave-room")
    public leaveRoom(@ConnectedSocket() socket: any, @MessageBody() messageBody: any): any {
        socket.leave(messageBody.roomId);
    }

    @OnMessage("connection-list")
    public connectionList(@ConnectedSocket() socket: any, @SocketIO() io: any): any {
        const userIds = [];
        for (const socketId in io.sockets.connected) {
            if (io.sockets.connected.hasOwnProperty(socketId)) {
                userIds.push(io.sockets.connected[socketId].user.id);
            }
        }

        socket.emit("connection-list", { type: "connection-list", content: userIds });
    }
}
