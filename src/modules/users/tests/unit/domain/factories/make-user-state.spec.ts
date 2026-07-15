import { describe, expect, it } from "vitest";
import { UserStateFactory } from "../../../../domain/factories/make-user-state.factory.js";
import { UserStatus } from "../../../../domain/entities/User.js";
import { PendingUserState } from "../../../../domain/states/user/pending-user.state.js";
import { VerifiedUserState } from "../../../../domain/states/user/verified-user.state.js";
import { BlockedUserState } from "../../../../domain/states/user/blocked-user.state.js";
import { EmailConfirmedState } from "../../../../domain/states/user/email-confirmed-user.state.js";

describe('MakeUserStateFactory', () => {
  it("should create PendingUserState", () => {
    const state = UserStateFactory.create(UserStatus.PENDING);
    expect(state).toBeInstanceOf(PendingUserState);
  })

  it("should create EmailConfirmedUserState", () => {
    const state = UserStateFactory.create(UserStatus.EMAIL_CONFIRMED);

    expect(state).toBeInstanceOf(EmailConfirmedState);
  });

  it("should create VerifiedUserState", () => {
    const state = UserStateFactory.create(UserStatus.VERIFIED);

    expect(state).toBeInstanceOf(VerifiedUserState);
  });

  it("should create BlockedUserState", () => {
    const state = UserStateFactory.create(UserStatus.BLOCKED);

    expect(state).toBeInstanceOf(BlockedUserState);
  });

  it("should throw when status is invalid", () => {
    expect(() =>
      UserStateFactory.create("INVALID" as UserStatus)
    ).toThrow("Invalid UserStatus: INVALID");
  });
})