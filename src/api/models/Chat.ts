import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    public id: number;
    public users;

    @OneToMany(type => Message, message => message.chat)
    public messages: Array<Message>;
}
