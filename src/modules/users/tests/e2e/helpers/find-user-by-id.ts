import { eq } from "drizzle-orm";
import { db } from "../../../../../shared/database/drizzle/client.js";
import { usersTable } from "../../../../../shared/database/schema/user-table.js";

export const findUserById = async (id: string) => {
  const [row] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return row;
};