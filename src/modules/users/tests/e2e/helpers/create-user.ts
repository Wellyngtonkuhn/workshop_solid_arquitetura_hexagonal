import request from "supertest";
import { FastifyInstance } from "fastify";
import { CreateUserInputDTO } from "../../../application/useCases/create/create-user-input.js";

export async function createUser(app: FastifyInstance, body: CreateUserInputDTO) {
  return await request(app.server).post("/api/users").send(body);
}