import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Chat } from "./chat";
import { Message } from "./message";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public username: string;

    @Column()
    public status: number;

    @Column()
    public avatar: string;

    @OneToMany(type => Message, message => message.sender)
    public messages: Array<Message>;

    @ManyToMany(type => Chat, chat => chat.users)
    public chats: Array<Chat>;
}
