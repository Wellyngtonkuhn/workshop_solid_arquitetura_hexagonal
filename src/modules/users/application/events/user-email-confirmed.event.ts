import { User } from "../../domain/entities/User.js";

export class UserEmailConfirmedEvent {
  constructor(
    public readonly user: User
  ){}
}