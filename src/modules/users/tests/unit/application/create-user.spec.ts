import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateUser } from "../../../application/useCases/create/CreateUser.js";
import { InMemoryUserRepository } from "../doubles/repositories/InMemoryUserRepository.js";
import { PasswordDoNotMatchError } from "../../../errors/password-do-not-match.error.js";
import { EmailAlreadyExistsError } from "../../../errors/email-already-exists.error.js";
import { FakeHashProvider } from "../doubles/providers/fake-hash-provider.js";

let repository: InMemoryUserRepository;
let hashProvider: FakeHashProvider;
let notificationService: {
  send: ReturnType<typeof vi.fn>;
};
let tokenProvider: {
  sign: ReturnType<typeof vi.fn>;
};
let sut: CreateUser;

const body = {
  name: "João",
  age: 30,
  email: "joao@email.com",
  phoneNumber: "+5511999999999",
  password: "12345678",
  passwordConfirmation: "12345678",
  preferredMarketingChannel: "email",
} as const;

beforeEach(() => {
  repository = new InMemoryUserRepository();
  hashProvider = new FakeHashProvider();

  notificationService = {
    send: vi.fn().mockResolvedValue(undefined),
  };

  tokenProvider = {
    sign: vi.fn().mockReturnValue("confirmation-token"),
  };

  sut = new CreateUser(
    repository,
    notificationService as any,
    hashProvider,
    tokenProvider as any,
  );
});

describe("Create - User", () => {
  it("should create a user successfully", async () => {
    const output = await sut.execute(body);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(body.name);
    expect(output.age).toBe(body.age);
    expect(output.email).toBe(body.email);
    expect(output.phoneNumber).toBe(body.phoneNumber);
    expect(output.preferredMarketingChannel).toBe(body.preferredMarketingChannel);
  });

  it("should throw when passwords do not match", async () => {
    await expect(
      sut.execute({
        ...body,
        passwordConfirmation: "outra",
      }),
    ).rejects.toBeInstanceOf(PasswordDoNotMatchError);
  });

  it("should throw when email already exists", async () => {
    await sut.execute(body);
    await expect(sut.execute(body)).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });

  it("should hash password before saving user", async () => {
    const hashSpy = vi.spyOn(hashProvider, "hash");
    await sut.execute(body);
    expect(hashSpy).toHaveBeenCalledWith(body.password);
  });

  it("should generate confirmation token and send notification", async () => {
    await sut.execute(body);
    expect(tokenProvider.sign).toHaveBeenCalledOnce();
    expect(notificationService.send).toHaveBeenCalledOnce();
  });
});
