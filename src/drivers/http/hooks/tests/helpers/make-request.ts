import { FastifyRequest } from "fastify";

export function makeRequest(
  authorization?: string,
): FastifyRequest {
  return {
    headers: {
      authorization,
    },
    user: undefined,
  } as unknown as FastifyRequest;
}