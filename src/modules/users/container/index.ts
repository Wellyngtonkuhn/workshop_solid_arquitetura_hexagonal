import { bcryptHashProvider, database, globalEventBus, jwtProvider, notificationService } from "../../../shared/container/index.js";
import { UserConfirmEmail } from "../application/useCases/confirm-email/index.js";
import { CreateUser } from "../application/useCases/create/CreateUser.js";
import { UpdateUser } from "../application/useCases/update/index.js";
import { DrizzelUserRepository } from "../infrastructure/repositories/DrizzleUserRepository.js";

const repository = new DrizzelUserRepository(database);

export function makeCreateUser() {
  return new CreateUser(
    repository,
    notificationService,
    bcryptHashProvider,
    jwtProvider,
  );
}

export function makeUpdateUser(){
  return new UpdateUser(repository);
}

export function makeConfirmEmailUser(){
  return new UserConfirmEmail(repository, jwtProvider, globalEventBus);
}