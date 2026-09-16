export type TokenPurpose = 'email_confirmation' | 'authentication'
export type TokenType = 'access' | 'refresh'

export interface TokenPayload {
  sub: string;
  purpose: TokenPurpose;
  type?: TokenType
}

export interface TokenProvider {
  sign(payload: TokenPayload, expiresInMinutes: number): string
  verify(token: string): TokenPayload
}