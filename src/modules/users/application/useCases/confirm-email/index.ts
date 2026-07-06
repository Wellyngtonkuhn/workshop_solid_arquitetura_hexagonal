import { UserRepository } from "../../../domain/repositories/user-repository.js";
import { TokenProvider } from "../../../../../shared/application/ports/token-provider.js";

export class UserConfirmEmail {
  constructor(
    private repository: UserRepository,
    private tokenProvider: TokenProvider
  ){}

  async execute(token: string): Promise<void>{
    console.log('>>> token', token)
  }
}