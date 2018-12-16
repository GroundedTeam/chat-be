import { Get, JsonController } from "routing-controllers";
import { getRepository, Repository } from "typeorm";

import { User } from "../models/user";

@JsonController("/users")
export class UserController {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    @Get("/")
    public async findAll(): Promise<Array<User>> {
        return this.userRepository.find();
    }
}
