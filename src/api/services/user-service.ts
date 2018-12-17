import axios from "axios";
import { Service } from "typedi";
import { getRepository, Repository } from "typeorm";

import { User } from "../models/user";

@Service()
export class UserService {
    private userRepository: Repository<User>;
    private randomUsernameApi = "https://randomuser.me/api";
    private avatarApi = "https://avatars.dicebear.com/v2/male";

    constructor() {
        this.userRepository = getRepository(User);
    }

    public async create(socketId: string, type: string = User.TYPE_USER, username: string): Promise<User> {
        if (type === User.TYPE_BOT) {
            const bot = await this.userRepository.findOne({ username });
            if (bot) {
                bot.socketId = socketId;
                await this.userRepository.save(bot);
                return bot;
            }
        }
        const user = new User();
        if (username) {
            user.username = username;
        } else {
            user.username = await this.getRandomUsername();
        }
        user.avatar = this.getAvatarUrl(user.username);
        user.socketId = socketId;
        user.type = type;

        return this.userRepository.save(user);
    }

    public async findById(id: number): Promise<User> {
        return this.userRepository.findOne(id);
    }

    public async findBySocketId(id: string): Promise<User> {
        return this.userRepository.findOne({ socketId: id });
    }

    public findAll(): Promise<Array<User>> {
        return this.userRepository.find();
    }

    private async getRandomUsername(): Promise<string> {
        try {
            const randomUserJSON = await axios.get(this.randomUsernameApi);
            const userObject = randomUserJSON.data;

            return userObject.results[0].login.username;
        } catch (error) {
            throw error;
        }
    }

    private getAvatarUrl(username: string): string {
        return `${this.avatarApi}/${username}.svg`;
    }
}
