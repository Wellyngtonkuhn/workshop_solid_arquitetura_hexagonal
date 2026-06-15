import { eq } from "drizzle-orm";
import { CreateUserRepositoryInput, UserRepository } from "../../../domain/repositories/user-repository.js";
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

  async createUser(body: CreateUserRepositoryInput): Promise<User> {
    const [userCreated] = await db
      .insert(usersTable)
      .values({
        name: body.name,
        age: body.age,
        email: body.email,
        password: body.password,
        phoneNumber: body.phoneNumber,
        preferredMarketingChannel: body.preferredMarketingChannel,
      })
      .returning();

      return UserMapper.toDomain(userCreated)
  }
}
