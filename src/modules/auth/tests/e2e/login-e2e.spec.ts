import { buildApp } from "@/drivers/app.js";
import { DrizzelUserRepository } from "@/modules/users/infrastructure/repositories/DrizzleUserRepository.js";
import { createVerifiedUser } from "@/modules/users/tests/e2e/helpers/create-verified-user.js";
import { makeCreateUserBody } from "@/modules/users/tests/e2e/helpers/make-create-user-body.js";
import { bcryptHashProvider } from "@/shared/container/index.js";
import { db } from "@/shared/database/drizzle/client.js";
import { sessionsTable } from "@/shared/database/schema/session-table.js";
import { usersTable } from "@/shared/database/schema/user-table.js";
import { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { loginHelper } from "./helpers/login.helper.js";
import { LoginDTO } from "../../application/useCases/login/login.dto.js";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
})

afterAll(() => {
  app.close();
})

beforeEach(async () => {
  await db.delete(usersTable)
  await db.delete(sessionsTable)
})

describe("Login", () => {
  const userRepository = new DrizzelUserRepository(db);
  it("should login successfully", async () => {
    const userBody = makeCreateUserBody()
    const verifiedUser = await createVerifiedUser(userBody, userRepository, bcryptHashProvider)
    const body: LoginDTO = {
      password: userBody.password,
      email: userBody.email
    }
    const response = await loginHelper(app, body)

    expect(response.status).toBe(200)

    expect(response.body.user).toEqual({
      id: verifiedUser.propsData.id,
      email: verifiedUser.propsData.email,
      name: verifiedUser.propsData.name,
    })

    expect(response.body.token.access_token).toBeTruthy()
    expect(response.body.token.refresh_token).toBeTruthy()

    const sessions = await db.select().from(sessionsTable)

    expect(sessions).toHaveLength(1)
    expect(sessions[0].user_id).toBe(verifiedUser.propsData.id)
    expect(sessions[0].refresh_token_hash).toBeTruthy()
    expect(sessions[0].refresh_token_hash).not.toBe(response.body.token.refresh_token)
  })
})