import { TokenPayload, TokenProvider } from "@/shared/application/ports/token-provider.js";

export class FakeTokenProvider implements TokenProvider {
  payload: TokenPayload = {
    sub: "user-id",
    purpose: "authentication",
    type: "access",
  };
  
  sign(payload: TokenPayload, expiresInMinutes: number): string {
    return `fake-${payload.type}`;
  }

  verify(token: string): TokenPayload {
     return this.payload;
  } 
}