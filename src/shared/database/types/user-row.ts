import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { usersTable } from "../schema/user-table.js";


export type UserRow = InferSelectModel<typeof usersTable>

export type CreateUserRow = InferInsertModel<typeof usersTable>