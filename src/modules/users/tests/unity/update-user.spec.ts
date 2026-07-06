import { beforeEach, describe, expect, it } from "vitest";
import { UpdateUser } from "../../application/useCases/update/index.js";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository.js";
import { UserNotFound } from "../../errors/user-not-found.error.js";
import { User } from "../../domain/entities/User.js";
import { UserCannotUpdateProfileError } from "../../errors/cannot-update-profile.error.js";

let repository: InMemoryUserRepository;
let sut: UpdateUser;

beforeEach(() => {
  repository = new InMemoryUserRepository();
  sut = new UpdateUser(repository);
});

describe('UseCase - Update user', () => {
  it('should throw UserNotFound when user does not exist', async () => {
    await expect((
      sut.execute('123', {
        name: "Novo",
        age: 30,
        phoneNumber: "+5511999999999",
        preferredMarketingChannel: "sms",
      })
    )).rejects.toBeInstanceOf(UserNotFound)
  })

  it('should throw UserCannotUpdateProfileError when user can not update his own profile', async () => {
    const user = User.create({
      name: "João",
      age: 20,
      email: "joao@email.com",
      password: "123",
      phoneNumber: "+5511999999999",
      preferredMarketingChannel: "email",
    })

    user.propsData.id = "1";

    await repository.save(user);
    
    await expect((
      sut.execute('1', {
        name: "Novo",
        age: 30,
        phoneNumber: "+5511999999999",
        preferredMarketingChannel: "sms",
      })
    )).rejects.toBeInstanceOf(UserCannotUpdateProfileError)
  })

  it('should update a user', async () => {
    const user = User.create({
      name: "João",
      age: 20,
      email: "joao@email.com",
      password: "123",
      phoneNumber: "+5511999999999",
      preferredMarketingChannel: "email",
    });

    user.propsData.id = "3";
    user.register()
    user.activate()

    await repository.save(user);

    await sut.execute("3", {
      name: "Pedro",
      age: 40,
      phoneNumber: "+5511988888888",
      preferredMarketingChannel: "sms",
    });

    const updated = await repository.findById("3");

    expect(updated?.propsData.name).toBe("Pedro");

    expect(updated?.propsData.age).toBe(40);

    expect(updated?.propsData.phoneNumber).toBe("+5511988888888");

    expect(updated?.propsData.preferredMarketingChannel).toBe("sms");
  });
})