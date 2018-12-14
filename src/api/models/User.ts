import {
    Column, CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";

import { Chat } from "./chat";
import { Message } from "./message";

@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public username: string;

    @Column()
    public avatar: string;

    @Column({
        name: "socket_id",
        nullable: true,
    })
    public socketId: string;

    @OneToMany(type => Message, message => message.sender, { onDelete: "CASCADE" })
    public messages: Array<Message>;

    @ManyToMany(type => Chat, chat => chat.users, { onDelete: "CASCADE" })
    public chats: Array<Chat>;

    @CreateDateColumn({
        name: "created_at",
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
    })
    public updatedAt: Date;
}
