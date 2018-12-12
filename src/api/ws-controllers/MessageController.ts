import {
    ConnectedSocket,
    MessageBody,
    OnConnect,
    OnDisconnect,
    OnMessage,
    SocketController,
    SocketIO,
} from "socket-controllers";
import { Service } from "typedi";

import { User } from "../models/User";
import { UserService } from "../services/UserService";

@SocketController()
export class MessageController {
    private user: User;
    // private socket: any;

    constructor(@Service() private userService: UserService) {}

    @OnConnect()
    public async connection(
        @ConnectedSocket() socket: any,
        @SocketIO() io: any,
    ): Promise<any> {
        this.user = await this.userService.create();
        // this.socketId = socketId;
        // this.socket = socket;

        console.log(`User ${this.user.username} connected!`);

        io.to(socket.id).emit("register", {
            type: "new-user",
            text: this.user,
        });
    }

    @OnDisconnect()
    public async disconnect(@ConnectedSocket() socket: any): Promise<any> {
        await this.userService.updateStatus(this.user, 0);
        console.log(`client ${this.user.username} disconnected`);
    }

    @OnMessage("save")
    public save(
        @ConnectedSocket() socket: any,
        @MessageBody() message: string,
    ): any {
        console.log("received message:", message);
        console.log(
            "setting id to the message and sending it back to the client",
        );
        message = "Some message";
        socket.emit("message_saved", message);
    }
}
