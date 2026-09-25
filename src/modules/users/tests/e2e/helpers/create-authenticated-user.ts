import { CreateUserInputDTO } from "@/modules/users/application/useCases/create/create-user-input.js";
import { FastifyInstance } from "fastify";
import { createUser } from "./create-user.js";
import { database } from "@/shared/container/index.js";
import { usersTable } from "@/shared/database/schema/user-table.js";
import { UserStatus } from "@/modules/users/domain/entities/User.js";
import { eq } from "drizzle-orm";
import { helperLoginUser } from "@/modules/auth/tests/helpers/login-user.js";
import { expect } from "vitest";

export async function createAuthenticatedUser(app: FastifyInstance, createUserBody: CreateUserInputDTO) {
  const createResponse = await createUser(app, createUserBody);

  const id = createResponse.body.id;

  await database.update(usersTable).set({ status: UserStatus.VERIFIED }).where(eq(usersTable.id, id));

  const loginResponse = await helperLoginUser(
    app,
    createUserBody.email,
    createUserBody.password,
  );

  expect(loginResponse.statusCode).toBe(200);

  return {
    id,
    accessToken: loginResponse.json().token.access_token,
  };
}