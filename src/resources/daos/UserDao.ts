import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { usersTable } from "../db/schema.js";
import bcrypt from "bcrypt"

export class UserDao {
  async findByEamil(email: string): Promise<any>{
    const [ existingUser ] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return existingUser
  }

  async createUser(body: any): Promise<any> {
    const [userCreated] = await db
      .insert(usersTable)
      .values({
        name: body.name,
        age: body.age,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
        phoneNumber: body.phoneNumber,
        proferredMarketingChannel: body.preferredMarketingChannel,
      })
      .returning();

      return userCreated
  }
}