import { DrizzelUserRepository } from "../../infrastructure/repositories/DrizzleUserRepository.js";
import { UpdateUser } from "../useCases/update/index.js";

export function makeUpdateUsers(){
  console.log("✔ UpdateUSer initialized");
  const userRepository = new DrizzelUserRepository()

  return new UpdateUser(userRepository)
}