export interface TokenPayload {
  sub: string;
}

export interface TokenProvider {
  sign(payload: TokenPayload, expiresInMinutes: number): string
  verify(token: string): TokenPayload
}