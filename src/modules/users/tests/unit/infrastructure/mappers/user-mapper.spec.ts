import { describe, expect, it } from "vitest";
import { UserRow } from "../../../../../../shared/database/types/user-row.js";
import { UserStatus } from "../../../../domain/entities/User.js";
import { UserMapper } from "../../../../infrastructure/mappers/user-mapper.js";

describe("UserMapper", () => {
  it("should map a user row to a domain entity", () => {
    const row: UserRow = {
      id: "1",
      name: "João",
      age: 20,
      email: "joao@email.com",
      password: "123456",
      phoneNumber: "+5511999999999",
      preferredMarketingChannel: "email",
      status: UserStatus.PENDING,
    };

    const user = UserMapper.toDomain(row);

    expect(user.propsData).toEqual({
      ...row,
      status: UserStatus.PENDING,
    });
  });

  it("should restore the correct behavior for a verified user", () => {
    const row: UserRow = {
      id: "1",
      name: "João",
      age: 20,
      email: "joao@email.com",
      password: "123456",
      phoneNumber: "+5511999999999",
      preferredMarketingChannel: "email",
      status: UserStatus.VERIFIED,
    };

    const user = UserMapper.toDomain(row);

    expect(user.getStatus()).toBe(UserStatus.VERIFIED);
    expect(user.canLogin()).toBe(true);
  });

  it("should restore the correct behavior for a pending user", () => {
    const row: UserRow = {
      id: "1",
      name: "João",
      age: 20,
      email: "joao@email.com",
      password: "123456",
      phoneNumber: "+5511999999999",
      preferredMarketingChannel: "email",
      status: UserStatus.PENDING,
    };

    const user = UserMapper.toDomain(row);

    expect(user.getStatus()).toBe(UserStatus.PENDING);
    expect(user.canLogin()).toBe(false);
  });
});