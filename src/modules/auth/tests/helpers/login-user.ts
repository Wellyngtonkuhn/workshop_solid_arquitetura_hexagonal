import { FastifyInstance } from "fastify";

export async function helperLoginUser(app: FastifyInstance, email: string, password: string) {
  return app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email,
      password,
    },
  });
}