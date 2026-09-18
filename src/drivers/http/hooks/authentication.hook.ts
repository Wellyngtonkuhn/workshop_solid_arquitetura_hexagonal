import { FastifyRequest } from "fastify";
import { TokenProvider, TokenPayload } from "@/shared/application/ports/token-provider.js";
import { InvalidAccessTokenError } from "@/modules/auth/errors/invalid-access-token.error.js";
import { jwtProvider } from "@/shared/container/index.js";

export function makeAuthenticationHook(tokenProvider: TokenProvider) {
  return async function authenticationHook(request: FastifyRequest): Promise<void> {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new InvalidAccessTokenError();
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new InvalidAccessTokenError();
    }

    let payload: TokenPayload;

    try {
      payload = tokenProvider.verify(token);
    } catch {
      throw new InvalidAccessTokenError();
    }

    if (payload.purpose !== "authentication" || payload.type !== "access" || !payload.sub) {
      throw new InvalidAccessTokenError();
    }

    request.user = {
      id: payload.sub,
    };
  };
}

export const authenticationHook = makeAuthenticationHook(jwtProvider);