import jwt from "jsonwebtoken";
import { TokenPayload, TokenProvider } from "../../../application/ports/token-provider.js";
import { env } from "../../../config/env.js";

export class JwtTokenProvider implements TokenProvider {
  private readonly secret = env.JWT_SECRET

  sign(payload: TokenPayload, expiresInMinutes: number): string {
    return jwt.sign(
      payload,
      this.secret,
      {
        expiresIn: `${expiresInMinutes}m`
      }
    )
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, this.secret) as TokenPayload
  }
} 