import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat";
import { User } from "./user";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public text: string;

    @Column({
        name: "sender_id",
    })
    public senderId: number;

    @ManyToOne(type => User, user => user.messages)
    @JoinColumn({
        name: "sender_id",
    })
    public sender: User;

    @Column({
        name: "chat_id",
    })
    public chatId: number;

    @ManyToOne(type => Chat, chat => chat.messages)
    @JoinColumn({
        name: "chat_id",
    })
    public chat: Chat;

    @CreateDateColumn({
        name: "create_at",
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: "update_at",
    })
    public updatedAt: Date;
}
