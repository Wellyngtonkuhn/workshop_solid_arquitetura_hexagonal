import { User } from "../../../domain/entities/User.js"
import { UserRow } from "../types/user-row.js"

export class UserMapper {
  static toDomain(row: UserRow): User {
    return {
      id: row.id,
      name: row.name,
      age: row.age,
      email: row.email,
      password: row.password,
      phoneNumber: row.phoneNumber,
      preferredMarketingChannel:
        row.preferredMarketingChannel
    }
  }
}