import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./Chat";
import { User } from "./User";

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
