import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat";
import { User } from "./user";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public text: string;

    @Column()
    public createdAt: Date;

    @ManyToOne(type => User, user => user.messages)
    public sender: User;

    @ManyToOne(type => Chat, chat => chat.messages)
    public chat: Chat;
}
