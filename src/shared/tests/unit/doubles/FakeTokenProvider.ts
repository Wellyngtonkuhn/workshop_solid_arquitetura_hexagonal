import { TokenPayload, TokenProvider } from "@/shared/application/ports/token-provider.js";

export class FakeTokenProvider implements TokenProvider {
  sign(payload: TokenPayload, expiresInMinutes: number): string {
    return `fake-${payload.type}`;
  }
  verify(token: string): TokenPayload {
    throw new Error("Method not implemented.");
  }
  
}