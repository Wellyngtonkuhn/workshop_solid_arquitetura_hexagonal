import { eq } from "drizzle-orm";
import { UserRepository } from "../../domain/repositories/user-repository.js";
import { User } from "../../domain/entities/User.js";
import { UserMapper } from "../mappers/user-mapper.js";
import { db } from "../../../../shared/database/drizzle/client.js";
import { usersTable } from "../../../../shared/database/schema/user-table.js";
import { mapDrizzleError } from "../../../../shared/database/drizzle-error-mapper.js";
import { userDbErrorMap } from "./user-db-errors.js";

export class DrizzelUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!existingUser) {
      return null;
    }
    return UserMapper.toDomain(existingUser);
  }

  async findById(id: string): Promise<User | null> {
    const [ user ] = await db.select().from(usersTable).where(eq(usersTable.id, id))

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user)
  }

  async save(user: User): Promise<User> {
    try {
      const [userCreated] = await db
        .insert(usersTable)
        .values({
          name: user.propsData.name,
          age: user.propsData.age,
          email: user.propsData.email,
          password: user.propsData.password,
          phoneNumber: user.propsData.phoneNumber,
          preferredMarketingChannel: user.propsData.preferredMarketingChannel,
          status: user.getStatus(),
        })
        .returning();

      return UserMapper.toDomain(userCreated);
    } catch (error) {
      mapDrizzleError(error, userDbErrorMap);
    }
  }

  async update(user: User): Promise<void> {
    try {
      await db.update(usersTable).set({
        name: user.propsData.name,
        age: user.propsData.age,
        phoneNumber: user.propsData.phoneNumber,
        preferredMarketingChannel: user.propsData.preferredMarketingChannel,
        status: user.propsData.status        
      }).where(eq(usersTable.id, user.propsData.id!))
    } catch (error) {
      mapDrizzleError(error, userDbErrorMap);
    }
  }
}
