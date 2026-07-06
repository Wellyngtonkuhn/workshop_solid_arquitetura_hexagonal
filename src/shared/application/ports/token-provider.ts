export type TokenPurpose = 'email_confirmation' | 'authentication'

export interface TokenPayload {
  sub: string;
  purpose: TokenPurpose;
}

export interface TokenProvider {
  sign(payload: TokenPayload, expiresInMinutes: number): string
  verify(token: string): TokenPayload
}