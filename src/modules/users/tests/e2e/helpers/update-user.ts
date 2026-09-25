import request from "supertest";
import { FastifyInstance } from "fastify";
import { UpdateUserInputDTO } from "../../../application/useCases/update/input.dto.js";

export async function updateUser(app: FastifyInstance, id: string, body: UpdateUserInputDTO, accessToken: string,) {
   return app.inject({
    method: "PATCH",
    url: `/api/users/${id}`,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    payload: body,
  });
}