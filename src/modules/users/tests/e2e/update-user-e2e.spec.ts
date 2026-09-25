import { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../../../../drivers/app.js";
import { db } from "../../../../shared/database/drizzle/client.js";
import { usersTable } from "../../../../shared/database/schema/user-table.js";
import { UpdateUserInputDTO } from "../../application/useCases/update/input.dto.js";
import { CreateUserInputDTO } from "../../application/useCases/create/create-user-input.js";
import { eq } from "drizzle-orm";
import { createUser } from "./helpers/create-user.js";
import { updateUser } from "./helpers/update-user.js";
import { UserStatus } from "../../domain/entities/User.js";
import { findUserById } from "./helpers/find-user-by-id.js";
import { makeCreateUserBody } from "./helpers/make-create-user-body.js";
import { helperLoginUser } from "@/modules/auth/tests/helpers/login-user.js";
import { createAuthenticatedUser } from "./helpers/create-authenticated-user.js";
import { database } from "@/shared/container/index.js";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  await db.delete(usersTable)
})

const createUserBody: CreateUserInputDTO = makeCreateUserBody()

const updateUserBody: UpdateUserInputDTO = {
  name: "Mudei o nome",
  age: 50,
  phoneNumber: "+5511988447755",
  preferredMarketingChannel: "sms",
};

describe("Patch / users", () => {
  it('should have an error with status 404 when user does not exists', async () => {
    const { id, accessToken } = await createAuthenticatedUser(app, createUserBody);

    const updateResponse = await updateUser(app, 'a3756cfb-d2a2-4c1f-b8e4-603f7ba3db9a', updateUserBody, accessToken)
    expect(updateResponse.statusCode).toBe(404)
    const bodyResponse = updateResponse.json()
    expect(bodyResponse).toEqual({
      statusCode: 404,
      error: {
        code: "USER_NOT_FOUND",
        message: "Usuário não encontrado",
      }
    })    
  })

  it('users not verified must not be able to update their profile with an errror with status code 403', async () => {
    const { id, accessToken } = await createAuthenticatedUser(app, createUserBody);

    await database.update(usersTable).set({ status: UserStatus.PENDING }).where(eq(usersTable.id, id));
    const updateResponse = await updateUser(app, id, updateUserBody, accessToken)
    
    expect(updateResponse.statusCode).toBe(403)

    const responseBody = updateResponse.json()

    expect(responseBody).toEqual({
      statusCode: 403,
      error: {
        code: "USER_CANNOT_UPDATE",
        message: "Usuário não pode atualizar o perfil",
      }
    })
  })

  it("update a user and returns 204 and validate that the fields were updated correctly.", async () => {
    const { id, accessToken } = await createAuthenticatedUser(app, createUserBody);

    const updateResponse = await updateUser(app, id, updateUserBody, accessToken)

    expect(updateResponse.statusCode).toBe(204);

    const user = await findUserById(id)
    
    expect(user.name).toBe(updateUserBody.name);
    expect(user.age).toBe(updateUserBody.age);
    expect(user.phoneNumber).toBe(updateUserBody.phoneNumber);
    expect(user.preferredMarketingChannel).toBe(updateUserBody.preferredMarketingChannel);
  })

  it("should return 409 when phone number already exists", async () => {
    const { id: userId01, accessToken: accessTokenUser01 } = await createAuthenticatedUser(app, createUserBody);

    const { id: userId02, accessToken: accessTokenUser02 } = await createAuthenticatedUser(app, {
      ...createUserBody, email: "user2@gmail.com",
      phoneNumber: "+5511966558877"
    });

    const response = await updateUser(app, userId01, {
      ...updateUserBody,
      phoneNumber: "+5511966558877",
    }, accessTokenUser01);

    expect(response.statusCode).toBe(409);

    const bodyResponse = response.json();

    expect(bodyResponse).toEqual({
      statusCode: 409,
      error: {
        code: "PHONE_ALREADY_EXISTS",
        message: "Phone already exists",
      },
    });
  });
})

describe("PATCH /users - validation fields", () => {
  it("should return 400 when name is empty", async () => {
    const { id, accessToken } = await createAuthenticatedUser(app, createUserBody);

    const response = await updateUser(app, id, {
      ...updateUserBody,
      name: "",
    }, accessToken);

    expect(response.statusCode).toBe(400);
    const bodyResponse = response.json();

    expect(bodyResponse.error.code).toBe("VALIDATION_ERROR");
    expect(bodyResponse.error.details).toContainEqual(
      expect.objectContaining({
        field: "name",
      }),
    );
  });

  it("should return 400 when age is less than 18", async () => {
    const { id, accessToken } = await createAuthenticatedUser(app, createUserBody);

    const response = await updateUser(app, id, {
      ...updateUserBody,
      age: 17,
    }, accessToken);

    expect(response.statusCode).toBe(400);
    const bodyResponse = response.json();

    expect(bodyResponse.error.details).toContainEqual(
      expect.objectContaining({
        field: "age",
      }),
    );
  });

  it("should return 400 when age is greater than 100", async () => {
    const { id, accessToken } = await createAuthenticatedUser(app, createUserBody);

    const response = await updateUser(app, id, {
      ...updateUserBody,
      age: 101,
    }, accessToken);

    expect(response.statusCode).toBe(400);
    const bodyResponse = response.json();

    expect(bodyResponse.error.details).toContainEqual(
      expect.objectContaining({
        field: "age",
      }),
    );
  });

  it("should return 400 when phone number is invalid", async () => {
    const { id, accessToken } = await createAuthenticatedUser(app, createUserBody);

    const response = await updateUser(app, id, {
      ...updateUserBody,
      phoneNumber: "123456",
    }, accessToken);

    expect(response.statusCode).toBe(400);
    const bodyResponse = response.json();

    expect(bodyResponse.error.details).toContainEqual(
      expect.objectContaining({
        field: "phoneNumber",
      }),
    );
  });

  it("should return 400 when preferredMarketingChannel is invalid", async () => {
    const { id, accessToken } = await createAuthenticatedUser(app, createUserBody);

    const response = await updateUser(app, id, {
      ...updateUserBody,
      preferredMarketingChannel: "telegram",
    }, accessToken);

    expect(response.statusCode).toBe(400);
    const bodyResponse = response.json();

    expect(bodyResponse.error.details).toContainEqual(
      expect.objectContaining({
        field: "preferredMarketingChannel",
      }),
    );
  });
});

