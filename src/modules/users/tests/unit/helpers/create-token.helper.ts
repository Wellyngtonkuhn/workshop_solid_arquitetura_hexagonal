import { TokenProvider, TokenPurpose } from "../../../../../shared/application/ports/token-provider.js";

export function createUnitTestToken(
  tokenProvider: TokenProvider,
  userId: string,
  purpose: TokenPurpose = "email_confirmation",
  expiresIn = 5,
) {
  return tokenProvider.sign({ sub: userId, purpose }, expiresIn);
}
