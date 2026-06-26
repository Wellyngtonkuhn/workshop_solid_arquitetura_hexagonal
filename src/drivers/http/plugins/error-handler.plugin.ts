import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { mapHttpError } from "../errors/http-error-mapper.js";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const response = mapHttpError(error);
    return reply.status(response.statusCode).send(response.body);
  });
}