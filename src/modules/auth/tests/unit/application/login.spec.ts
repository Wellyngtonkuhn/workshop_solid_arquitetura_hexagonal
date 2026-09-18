import { beforeEach, describe, expect, it } from "vitest";
import { InMemorySessionRepository } from "../../doubles/repository/inMemorySessionRepository.js";
import { TokenProvider } from "@/shared/application/ports/token-provider.js";
import { LoginUseCase } from "@/modules/auth/application/useCases/login/index.js";
import { HashProvider } from "@/modules/users/application/ports/hash-provider.js";
import { InMemoryUserRepository } from "@/modules/users/tests/unit/doubles/repositories/InMemoryUserRepository.js";
import { createUnitTestUser } from "@/modules/users/tests/unit/helpers/create-user.helper.js";
import { LoginDTO } from "@/modules/auth/application/useCases/login/login.dto.js";
import { env } from "@/shared/config/env.js";
import { InvalidCredentialsError } from "@/modules/auth/errors/invalid-credentials.error.js";
import { UserNotActivatedError } from "@/modules/auth/errors/user-not-activated.error.js";
import { FakeHashProvider } from "@/shared/tests/unit/doubles/FakeHashProvider.js";
import { FakeTokenProvider } from "@/shared/tests/unit/doubles/FakeTokenProvider.js";

let userRepository: InMemoryUserRepository;
let hashProvider: HashProvider;
let sessionRepository: InMemorySessionRepository;
let tokenProvider: TokenProvider;
let sut: LoginUseCase;

beforeEach(() => {
  userRepository = new InMemoryUserRepository();
  hashProvider = new FakeHashProvider();
  tokenProvider = new FakeTokenProvider();
  sessionRepository = new InMemorySessionRepository();
  sut = new LoginUseCase(userRepository, hashProvider, tokenProvider, sessionRepository);
});

describe("Login Usecase - Unit Test", () => {
  const accessTokenExpiresIn: number = env.ACCESS_TOKEN_EXPIRES_IN
  const refreshTokenExpiresIn: number = env.REFRESH_TOKEN_EXPIRES_IN

  it("should login successfully", async () => {
    const user = await createUnitTestUser(userRepository, hashProvider)
    user.register()
    user.activate()
    await userRepository.update(user)

    const loginBody: LoginDTO = {
      email: user.propsData.email,
      password: "123456789"
    }
    
    const response = await sut.execute(loginBody)
    const accessToken = tokenProvider.sign({ sub: user.propsData.id!, purpose: "authentication", type: "access" }, accessTokenExpiresIn)
    
    const refreshToken = tokenProvider.sign({ sub: user.propsData.id!, purpose: "authentication", type: "refresh"}, refreshTokenExpiresIn)

    expect(response).toEqual({
      user: {
        id: user.propsData.id,
        email: user.propsData.email,
        name: user.propsData.name,
      },
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    })

    expect(sessionRepository.sessions).toHaveLength(1)

    const session = sessionRepository.sessions[0]

    expect(session.propsData.userId).toBe(user.propsData.id)

    expect(session.propsData.refreshTokenHash).toBeTruthy()

    expect(session.propsData.expiresAt.getTime()).toBeGreaterThan(Date.now())
  });

  it("should throw Invalid Credentials Error when there is no user for given an email", async () => {
    const body: LoginDTO = {
      email: "wrong@email.com",
      password: '12345689'
    }
  
    await expect(sut.execute(body)).rejects.toBeInstanceOf(InvalidCredentialsError)
    expect(sessionRepository.sessions).toHaveLength(0)
  })

  it("should throw User Not Activated Error when user is not activeted", async () => {
    const user = await createUnitTestUser(userRepository, hashProvider)
    
    await userRepository.update(user)
    const body: LoginDTO = {
      email: user.propsData.email,
      password: user.propsData.password
    }
  
    await expect(sut.execute(body)).rejects.toBeInstanceOf(UserNotActivatedError)
    expect(sessionRepository.sessions).toHaveLength(0)
  })

  it("should throw Invalid Credentials Error when password is wrong", async () => {
    const user = await createUnitTestUser(userRepository, hashProvider)
    user.register()
    user.activate()
    await userRepository.update(user)
    const body: LoginDTO = {
      email: user.propsData.email,
      password: "wrong_password"
    }
  
    await expect(sut.execute(body)).rejects.toBeInstanceOf(InvalidCredentialsError)
    expect(sessionRepository.sessions).toHaveLength(0)
  })
});