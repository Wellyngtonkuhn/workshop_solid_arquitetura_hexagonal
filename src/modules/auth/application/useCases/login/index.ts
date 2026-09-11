import { HashProvider } from "@/modules/users/application/ports/hash-provider.js";
import { UserRepository } from "@/modules/users/domain/repositories/user-repository.js";
import { TokenProvider } from "@/shared/application/ports/token-provider.js";
import { LoginDTO } from "./login.dto.js";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider
  ){}

  async execute(body: LoginDTO): Promise<{ token: string}>{
    return {
      token: 'asdmalksdamdlamskl'
    }
  }
}