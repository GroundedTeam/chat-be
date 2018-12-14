import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Message } from "./message";
import { User } from "./user";

@Entity()
export class Chat {
    public static readonly CHAT_TYPE_PRIVATE = "private";

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        default: Chat.CHAT_TYPE_PRIVATE,
    })
    public type: string;

    @OneToMany(type => Message, message => message.chat)
    public messages: Array<Message>;

    @ManyToMany(type => User, user => user.chats)
    @JoinTable()
    public users: Array<User>;
}
