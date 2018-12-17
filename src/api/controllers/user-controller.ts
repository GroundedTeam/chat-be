import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";

import { User } from "../models/user";
import { UserService } from "../services/user-service";

@JsonController("/users")
export class UserController {
    constructor(@Service() private userService: UserService) {
    }

    @Get("/")
    public async findAll(): Promise<Array<User>> {
        return this.userService.findAll();
    }
}
