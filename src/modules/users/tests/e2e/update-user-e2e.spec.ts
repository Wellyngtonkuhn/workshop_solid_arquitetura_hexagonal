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
    const updateResponse = await updateUser(app, 'a3756cfb-d2a2-4c1f-b8e4-603f7ba3db9a', updateUserBody)
    expect(updateResponse.status).toBe(404)
    expect(updateResponse.body).toEqual({
      statusCode: 404,
      error: {
        code: "USER_NOT_FOUND",
        message: "Usuário não encontrado",
      }
    })    
  })

  it('users not verified must not be able to update their profile with an errror with status code 403', async () => {
    const createResponse = await createUser(app, createUserBody)
    expect(createResponse.status).toBe(201)
    
    const id = createResponse.body.id;
    const updateResponse = await updateUser(app, id, updateUserBody)
    
    expect(updateResponse.status).toBe(403)
    expect(updateResponse.body).toEqual({
      statusCode: 403,
      error: {
        code: "USER_CANNOT_UPDATE",
        message: "Usuário não pode atualizar o perfil",
      }
    })
  })

  it("update a user and returns 204 and validate that the fields were updated correctly.", async () => {
    const createResponse = await createUser(app, createUserBody)
    expect(createResponse.status).toBe(201)

    const id = createResponse.body.id;

    await db.update(usersTable).set({ status: UserStatus.VERIFIED }).where(eq(usersTable.id, id));

    const updateResponse = await updateUser(app, id, updateUserBody)

    expect(updateResponse.status).toBe(204);

    const user = await findUserById(id)
    
    expect(user.name).toBe(updateUserBody.name);
    expect(user.age).toBe(updateUserBody.age);
    expect(user.phoneNumber).toBe(updateUserBody.phoneNumber);
    expect(user.preferredMarketingChannel).toBe(updateUserBody.preferredMarketingChannel);
  })

  it("should return 409 when phone number already exists", async () => {
    const user1 = await createUser(app, {
      ...createUserBody,
      email: "user1@gmail.com",
      phoneNumber: "+5511999999999",
    });
    expect(user1.status).toBe(201)

    const user2 = await createUser(app, {
      ...createUserBody,
      email: "user2@gmail.com",
      phoneNumber: "+5511966558877",
    });
    expect(user2.status).toBe(201)

    await db.update(usersTable).set({ status: UserStatus.VERIFIED }).where(eq(usersTable.id, user1.body.id))
    await db.update(usersTable).set({ status: UserStatus.VERIFIED }).where(eq(usersTable.id, user2.body.id))

    const response = await updateUser(app, user1.body.id, {
      ...updateUserBody,
      phoneNumber: user2.body.phoneNumber,
    });


    expect(response.status).toBe(409);

    expect(response.body).toEqual({
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
    const created = await createUser(app, createUserBody);

    await db.update(usersTable).set({ status: UserStatus.VERIFIED }).where(eq(usersTable.id, created.body.id));

    const response = await updateUser(app, created.body.id, {
      ...updateUserBody,
      name: "",
    });

    expect(response.status).toBe(400);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details).toContainEqual(
      expect.objectContaining({
        field: "name",
      }),
    );
  });

  it("should return 400 when age is less than 18", async () => {
    const created = await createUser(app, createUserBody);

      await db.update(usersTable).set({ status: UserStatus.VERIFIED }).where(eq(usersTable.id, created.body.id));

    const response = await updateUser(app, created.body.id, {
      ...updateUserBody,
      age: 17,
    });

    expect(response.status).toBe(400);

    expect(response.body.error.details).toContainEqual(
      expect.objectContaining({
        field: "age",
      }),
    );
  });

  it("should return 400 when age is greater than 100", async () => {
    const created = await createUser(app, createUserBody);

    await db.update(usersTable).set({ status: UserStatus.VERIFIED }).where(eq(usersTable.id, created.body.id));

    const response = await updateUser(app, created.body.id, {
      ...updateUserBody,
      age: 101,
    });

    expect(response.status).toBe(400);

    expect(response.body.error.details).toContainEqual(
      expect.objectContaining({
        field: "age",
      }),
    );
  });

  it("should return 400 when phone number is invalid", async () => {
    const created = await createUser(app, createUserBody);

    await db.update(usersTable).set({ status: UserStatus.VERIFIED }).where(eq(usersTable.id, created.body.id));

    const response = await updateUser(app, created.body.id, {
      ...updateUserBody,
      phoneNumber: "123456",
    });

    expect(response.status).toBe(400);

    expect(response.body.error.details).toContainEqual(
      expect.objectContaining({
        field: "phoneNumber",
      }),
    );
  });

  it("should return 400 when preferredMarketingChannel is invalid", async () => {
    const created = await createUser(app, createUserBody);

    await db.update(usersTable).set({ status: UserStatus.VERIFIED }).where(eq(usersTable.id, created.body.id));

    const response = await updateUser(app, created.body.id, {
      ...updateUserBody,
      preferredMarketingChannel: "telegram",
    });

    expect(response.status).toBe(400);

    expect(response.body.error.details).toContainEqual(
      expect.objectContaining({
        field: "preferredMarketingChannel",
      }),
    );
  });
});

