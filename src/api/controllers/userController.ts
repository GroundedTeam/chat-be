import { Get, JsonController } from "routing-controllers";
import { getRepository, Repository } from "typeorm";

import { User } from "../models/User";

@JsonController("/client")
export class UserController {
    private userRepo: Repository<User>;

    constructor() {
        this.userRepo = getRepository(User);
    }

    @Get("/all")
    public async findAll(): Promise<Array<User>> {
        return this.userRepo.find();
    }
}
