import { EmailAlreadyExistsError } from "../../errors/email-already-exists.error.js";
import { PhoneAlreadyExistsError } from "../../errors/phone-already-exists.error.js";

export const userDbErrorMap = {
  users_email_unique: EmailAlreadyExistsError,
  users_phone_number_unique: PhoneAlreadyExistsError,
};