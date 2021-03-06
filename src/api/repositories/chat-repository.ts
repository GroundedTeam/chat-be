import { EntityRepository, Repository } from "typeorm";

import { Chat } from "../models/chat";

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
    public async findChatByUsers(usersId: Array<number>, type: string): Promise<Chat> {
        return this
            .createQueryBuilder("c")
            .select("c.id")
            .innerJoin("c.users", "u", "u.id IN (:...usersIds)", { usersIds: usersId })
            .andWhere("c.type = :type", { type })
            .groupBy("c.id")
            .having("COUNT(*) > 1")
            .getOne();
    }

    public async findByUser(userId: number): Promise<Array<Chat>> {
        return this
            .createQueryBuilder("c")
            .select("c.id")
            .innerJoin("c.users", "u", "u.id = :userId", { userId })
            .getMany();
    }
}
