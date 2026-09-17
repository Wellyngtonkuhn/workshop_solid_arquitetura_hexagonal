import { HashProvider } from "@/modules/users/application/ports/hash-provider.js";
import { User } from "../../../domain/entities/User.js";
import { InMemoryUserRepository } from "../doubles/repositories/InMemoryUserRepository.js";

export async function createUnitTestUser(repository: InMemoryUserRepository, hashProvider?: HashProvider) {
  const user = User.create({
    name: "João",
    age: 20,
    email: "joao@email.com",
    // password: "123",
    password: await hashProvider?.hash("123456789") || "123456789",
    phoneNumber: "+5511999999999",
    preferredMarketingChannel: "email",
  });

  return repository.save(user);
}
