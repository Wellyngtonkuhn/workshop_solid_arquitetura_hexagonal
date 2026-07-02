import { DrizzelUserRepository } from "../../infrastructure/repositories/DrizzleUserRepository.js";
import { UpdateUser } from "../useCases/update/index.js";

export function makeUpdateUsers(){
  const userRepository = new DrizzelUserRepository()

  return new UpdateUser(userRepository)
}