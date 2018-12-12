import axios from "axios";
import { Service } from "typedi";
import { getRepository, Repository } from "typeorm";
import { User } from "../models/User";

@Service()
export class UserService {
    private userRepo: Repository<User>;

    constructor() {
        this.userRepo = getRepository(User);
    }

    public async create(): Promise<User> {

        const user = new User();
        user.username = await this.getRandomUsername();
        user.avatar = this.getAvatarUrl(user.username);
        user.status = 1;

        return await this.userRepo.save(user);
    }

    public async updateStatus(user: User, status: number): Promise<User> {
        user.status = status;
        return await this.userRepo.save(user);
    }

    private async getRandomUsername(): Promise<string> {
        try {
            const randomUserJSON = await axios.get(
                "https://randomuser.me/api/",
            );
            const userObject = randomUserJSON.data;

            return userObject.results[0].login.username;
        } catch (error) {
            throw error;
        }
    }

    private getAvatarUrl(username: string): string {
        return `https://avatars.dicebear.com/v2/male/${username}.svg`;
    }
}
