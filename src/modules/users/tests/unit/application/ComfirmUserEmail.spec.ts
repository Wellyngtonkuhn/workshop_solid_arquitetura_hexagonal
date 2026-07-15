import { beforeEach, describe, expect, it } from "vitest";
import { UserConfirmEmail } from "../../../application/useCases/confirm-email/index.js";
import { InMemoryUserRepository } from "../doubles/repositories/InMemoryUserRepository.js";
import { TokenProvider } from "../../../../../shared/application/ports/token-provider.js";
import { JwtTokenProvider } from "../../../../../shared/infrastructure/security/token/index.js";
import { User, UserStatus } from "../../../domain/entities/User.js";
import { ExpiredTokenError } from "../../../errors/expired-token.error.js";
import { InvalidTokenError } from "../../../errors/invalid-token.error.js";
import { UserNotFound } from "../../../errors/user-not-found.error.js";
import { createUnitTestUser } from "../helpers/create-user.helper.js";
import { createUnitTestToken } from "../helpers/create-token.helper.js";

let repository: InMemoryUserRepository;
let tokenProvider: TokenProvider;
let sut: UserConfirmEmail;

beforeEach(() => {
  repository = new InMemoryUserRepository();
  tokenProvider = new JwtTokenProvider()
  sut = new UserConfirmEmail(repository, tokenProvider);
})

describe("UserConfirmEmail", () => {
  it("should confirm email successfully", async () => {
    const userCreated = await createUnitTestUser(repository)
    const token = createUnitTestToken(tokenProvider, userCreated.propsData.id!, 'email_confirmation', 5)
    await sut.execute(token)

    const user = await repository.findById(userCreated.propsData.id!)

    expect(user?.propsData.status).toBe(UserStatus.VERIFIED)
  })

  it("should throw ExpiredTokenError when token is expired", async () => {
    const userCreated = await createUnitTestUser(repository)
    const token = createUnitTestToken(tokenProvider, userCreated.propsData.id!, 'email_confirmation', 0)
    await expect(sut.execute(token)).rejects.toBeInstanceOf(ExpiredTokenError)
  })

  it("should throw InvalidTokenError when token is invalid", async () => {
    const token = 'asdhiasdihasuid'

    await expect(sut.execute(token)).rejects.toBeInstanceOf(InvalidTokenError)
  })

  it("should throw InvalidTokenError when token purpose is incorrect", async () => {
    const userCreated = await createUnitTestUser(repository)
    const token = createUnitTestToken(tokenProvider, userCreated.propsData.id!, 'authentication', 5)
    await expect(sut.execute(token)).rejects.toBeInstanceOf(InvalidTokenError)
  })

   it("should throw UserNotFound when user does not exist", async () => {
    const token = createUnitTestToken(tokenProvider, '9ddac3e2-085d-4801-b1c4-091634556853', 'email_confirmation', 5)

    await expect(sut.execute(token)).rejects.toBeInstanceOf(UserNotFound)
   })
})