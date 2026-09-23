import { HashProvider } from "@/modules/users/application/ports/hash-provider.js";
import { UserRepository } from "@/modules/users/domain/repositories/user-repository.js";
import { TokenProvider } from "@/shared/application/ports/token-provider.js";
import { LoginDTO } from "./login.dto.js";
import { InvalidCredentialsError } from "@/modules/auth/errors/invalid-credentials.error.js";
import { UserNotActivatedError } from "@/modules/auth/errors/user-not-activated.error.js";
import { LoginResult } from "./login-output.js";
import { ISessionRepository } from "@/modules/auth/domain/repository/session-repository.js";
import { Session } from "@/modules/auth/domain/entities/Session.js";
import { env } from "@/shared/config/env.js";

export class LoginUseCase {
  private readonly accessTokenExpiresIn: number = env.ACCESS_TOKEN_EXPIRES_IN
  private readonly refreshTokenExpiresIn: number = env.REFRESH_TOKEN_EXPIRES_IN
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider,
    private readonly sessionRepository: ISessionRepository,
  ){}

  async execute(body: LoginDTO): Promise<LoginResult>{
    const user = await this.userRepository.findByEmail(body.email)

    if(!user){
      throw new InvalidCredentialsError()
    }

    if(!user.canLogin()){
      throw new UserNotActivatedError()
    }
    
    const isSameHashPassword = await this.hashProvider.compare(body.password, user.propsData.password)

    if(!isSameHashPassword){
      throw new InvalidCredentialsError()
    }

    const accessToken = this.tokenProvider.sign({ sub: user.propsData.id!, purpose: "authentication", type: "access" }, this.accessTokenExpiresIn)
    
    const refreshToken = this.tokenProvider.sign({ sub: user.propsData.id!, purpose: "authentication", type: "refresh"}, this.refreshTokenExpiresIn)
    const refreshTokenHash = await this.hashProvider.hash(refreshToken)

    const expiresAt = new Date(
      Date.now() + this.refreshTokenExpiresIn * 60 * 1000
    )

    const session = Session.create({
      userId: user.propsData.id!,
      refreshTokenHash,
      expiresAt
    })

    await this.sessionRepository.save(session)

    return {
      user: {
        id: user.propsData.id!,
        email: user.propsData.email,
        name: user.propsData.name
      },
      token: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    }
  }
}