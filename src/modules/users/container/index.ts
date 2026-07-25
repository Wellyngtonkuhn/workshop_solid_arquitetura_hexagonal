import { database, globalEventBus } from "../../../shared/container/index.js";
import { NotificationService } from "../../../shared/infrastructure/notifications/Notification.service.js";
import { BcryptHashProvider } from "../../../shared/infrastructure/security/hash/hashProvider.js";
import { JwtTokenProvider } from "../../../shared/infrastructure/security/token/index.js";
import { UserConfirmEmail } from "../application/useCases/confirm-email/index.js";
import { CreateUser } from "../application/useCases/create/CreateUser.js";
import { UpdateUser } from "../application/useCases/update/index.js";
import { DrizzelUserRepository } from "../infrastructure/repositories/DrizzleUserRepository.js";

const repository = new DrizzelUserRepository(database);
const notificationService = new NotificationService();
const bcryptHashProvider = new BcryptHashProvider();
const jwtProvider = new JwtTokenProvider();

const createUser = new CreateUser(
  repository,
  notificationService,
  bcryptHashProvider,
  jwtProvider,
);

const updateUser = new UpdateUser(repository);

const confirmEmail = new UserConfirmEmail(repository, jwtProvider, globalEventBus);

export {
  createUser,
  updateUser,
  confirmEmail,
};
