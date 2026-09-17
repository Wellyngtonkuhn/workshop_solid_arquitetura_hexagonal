import { CreateUserInputDTO } from "../../../application/useCases/create/create-user-input.js";
import { User } from "@/modules/users/domain/entities/User.js";
import { UserRepository } from "@/modules/users/domain/repositories/user-repository.js";
import { HashProvider } from "@/modules/users/application/ports/hash-provider.js";

export async function createPendingUserHelper(body: CreateUserInputDTO, userRepository: UserRepository, hashProvider: HashProvider): Promise<User> {
  const user = User.create({
    name: body.name,
    age: body.age,
    email: body.email,
    password: await hashProvider.hash(body.password),
    phoneNumber: body.phoneNumber,
    preferredMarketingChannel: body.preferredMarketingChannel,
  })

  return await userRepository.save(user)
}