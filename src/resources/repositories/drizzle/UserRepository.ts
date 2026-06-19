import { eq } from "drizzle-orm";
import { UserRepository } from "../../../domain/repositories/user-repository.js";
import { db } from "../../database/drizzle/client.js";
import { usersTable } from "../../database/schema/user-table.js";
import { User } from "../../../domain/entities/User.js";
import { UserMapper } from "../../database/mappers/user-mapper.js";

export class DrizzelUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
      
    if(!existingUser){
      return null
    }
    return UserMapper.toDomain(existingUser)
  }

  async createUser(user: User): Promise<User > {
    const [userCreated] = await db
      .insert(usersTable)
      .values({
        name: user.propsData.name,
        age: user.propsData.age,
        email: user.propsData.email,
        password: user.propsData.password,
        phoneNumber: user.propsData.phoneNumber,
        preferredMarketingChannel: user.propsData.preferredMarketingChannel,
        status: user.getStatus()
      })
      .returning();

      return UserMapper.toDomain(userCreated)
  }
}
