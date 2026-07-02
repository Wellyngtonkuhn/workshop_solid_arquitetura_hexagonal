import { FastifyInstance } from "fastify";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
import request from 'supertest'
import { buildApp } from "../../../../drivers/app.js";
import { db } from "../../../../shared/database/drizzle/client.js";
import { usersTable } from "../../../../shared/database/schema/user-table.js";
import { eq } from "drizzle-orm";

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

const validBody = {
  name: "João Pedro",
  age: 45,
  phoneNumber: "+555483997874455",
  email: "joao.pedro@gmail.com",
  password: "123456789",
  passwordConfirmation: "123456789",
  preferredMarketingChannel: "email",
};

const post = (body: unknown) => request(app.server).post("/users").send(body as object);

const findByEmail = async (email: string) => {
  const [row] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return row;
};

describe("POST /users — success", () => {
  it("creates a user and returns 201 with the public fields (no password)", async () => {
    const response = await post(validBody)
    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      name: validBody.name,
      email: validBody.email,
      age: validBody.age,
      phoneNumber: validBody.phoneNumber,
      preferredMarketingChannel: validBody.preferredMarketingChannel,
    })
    expect(response.body.id).toEqual(expect.any(String))
    expect(response.body).not.toHaveProperty("password")
  })
})
