import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message";

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
}
