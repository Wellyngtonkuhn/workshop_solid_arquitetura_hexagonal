import request from "supertest";
import { FastifyInstance } from "fastify";
import { UpdateUserInputDTO } from "../../application/useCases/update/input.dto.js";

export async function updateUser(app: FastifyInstance, id: string, body: UpdateUserInputDTO) {
  return request(app.server).patch(`/users/${id}`).send(body);
}