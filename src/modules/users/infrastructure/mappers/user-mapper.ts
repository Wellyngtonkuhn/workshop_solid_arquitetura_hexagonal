import { UserStateFactory } from "../../domain/factories/make-user-state.factory.js";
import { User, UserStatus } from "../../domain/entities/User.js";
import { UserRow } from "../../../../shared/database/types/user-row.js";

export class UserMapper {
  static toDomain(row: UserRow): User {
    return User.restore(
      { ...row, status: row.status as UserStatus },
      UserStateFactory.create(row.status as UserStatus),
    );
  }
}
