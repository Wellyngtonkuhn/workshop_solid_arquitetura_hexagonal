import { randomUUID } from "node:crypto";
import { CreateUserInputDTO } from "../../../application/useCases/create/create-user-input.js";

export function makeCreateUserBody(overrides = {}): CreateUserInputDTO {
  const unique = randomUUID();

  return {
    name: "Gustavo",
    age: 45,
    email: `${unique}@gmail.com`,
    phoneNumber: `+55119${Math.floor(100000000 + Math.random() * 900000000)}`,
    password: "123456789",
    passwordConfirmation: "123456789",
    preferredMarketingChannel: "email",
    ...overrides,
  };
}