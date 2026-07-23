import { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { buildApp } from "../../../../drivers/app.js";
import { db } from "../../../../shared/database/drizzle/client.js";
import { usersTable } from "../../../../shared/database/schema/user-table.js";
import { CreateUserInputDTO } from "../../application/useCases/create/create-user-input.js";
import { createUser } from "./helpers/create-user.js";
import { JwtTokenProvider } from "../../../../shared/infrastructure/security/token/index.js";
import { findUserById } from "./helpers/find-user-by-id.js";
import { UserStatus } from "../../domain/entities/User.js";
import { makeCreateUserBody } from "./helpers/make-create-user-body.js";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  await db.delete(usersTable);
});

const createUserBody: CreateUserInputDTO = makeCreateUserBody()

describe("Confirm user Email / users/email-confirmation", () => {
  const tokenProvider = new JwtTokenProvider()

  it('should confirm email successfully', async () => {
    const createResponse = await createUser(app, createUserBody)
    expect(createResponse.status).toBe(201)

    const token = tokenProvider.sign({ sub: createResponse.body.id, purpose: 'email_confirmation' }, 10)
   
    const confirmEmailResponse = await request(app.server).patch("/api/users/email-confirmation").send({ token });
    expect(confirmEmailResponse.status).toBe(204);

    const user = await findUserById(createResponse.body.id)

    expect(user.status).toBe(UserStatus.VERIFIED)
  })

  it('should return 400 when body is invalid', async () => {
    const createResponse = await createUser(app, createUserBody)
    expect(createResponse.status).toBe(201)

    const confirmEmailResponse = await request(app.server).patch("/api/users/email-confirmation").send({  });
    expect(confirmEmailResponse.status).toBe(400);
    expect(confirmEmailResponse.body.error.code).toBe("VALIDATION_ERROR");
    expect(confirmEmailResponse.body.error.details).toContainEqual(
      expect.objectContaining({
        field: "token",
      }),
    );
  })

  it('should return 401 when token is invalid', async () => {
    const confirmEmailResponse = await request(app.server).patch("/api/users/email-confirmation").send({ token: 'asdasdasd' });
    expect(confirmEmailResponse.status).toBe(401);
    expect(confirmEmailResponse.body.error.code).toBe("INVALID_TOKEN");
  })

  it('should return 401 when token is expired', async () => {
    const token = tokenProvider.sign({ sub: 'ahsiudhasid', purpose: 'email_confirmation' }, 0)
    const confirmEmailResponse = await request(app.server).patch("/api/users/email-confirmation").send({ token });
    expect(confirmEmailResponse.status).toBe(401);
    expect(confirmEmailResponse.body.error.code).toBe("EXPIRED_TOKEN");
  })

  it('should return 401 when purpose is different of email_confirmation', async () => {
    const token = tokenProvider.sign({ sub: 'ahsiudhasid', purpose: 'authentication' }, 5)
    const confirmEmailResponse = await request(app.server).patch("/api/users/email-confirmation").send({ token });
    expect(confirmEmailResponse.status).toBe(401);
    expect(confirmEmailResponse.body.error.code).toBe("INVALID_TOKEN");
  })

  it('should return 401 when not found a user', async () => {
    const token = tokenProvider.sign({ sub: '5a56b41e-8c8c-42ef-b35b-3b1cea08dad7', purpose: 'email_confirmation' }, 5)
    const confirmEmailResponse = await request(app.server).patch("/api/users/email-confirmation").send({ token });
    expect(confirmEmailResponse.status).toBe(404);
    expect(confirmEmailResponse.body).toEqual({
      statusCode: 404,
      error: {
        code: "USER_NOT_FOUND",
        message: "Usuário não encontrado",
      }
    })  
  })
})
