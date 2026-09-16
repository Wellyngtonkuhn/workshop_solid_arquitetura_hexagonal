import request from "supertest";
import { FastifyInstance } from "fastify";
import { LoginDTO } from "@/modules/auth/application/useCases/login/login.dto.js";

export async function loginHelper(app: FastifyInstance, body: LoginDTO) {
  return await request(app.server).post("/api/auth/login").send(body);
}