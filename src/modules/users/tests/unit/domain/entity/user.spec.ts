import { describe, expect, it } from "vitest";
import { User, UserStatus } from "../../../../domain/entities/User.js";
import { VerifiedUserState } from "../../../../domain/states/user/verified-user.state.js";


describe("User entity", () => {
  const props = {
    name: "João",
    age: 25,
    email: "joao@email.com",
    password: "12345678",
    phoneNumber: "+5511999999999",
    preferredMarketingChannel: "email",
  };

  it("should create a peding user", () => {
    const user = User.create(props)
    expect(user.getStatus()).toBe("PENDING");
    expect(user.propsData).toMatchObject({
      ...props,
      status: UserStatus.PENDING
    })
  });

  it('should restore a verified user preserving its state and data', () => {
    const user = User.restore({
        id: 'user-id',
        ...props,
        status: UserStatus.VERIFIED
      },
      new VerifiedUserState()
    ) 
    expect(user.propsData.id).toBe("user-id");
    expect(user.getStatus()).toBe(UserStatus.VERIFIED);
    expect(user.propsData).toMatchObject({
      ...props,
      status: UserStatus.VERIFIED
    })
  })

  it("should synchronize status after activate", () => {
    const user = User.create(props)
    user.register()
    user.activate()

    expect(user.getStatus()).toBe(UserStatus.VERIFIED)
  })

  it("should synchronize status after block", () => {
    const user = User.restore(
      {
        id: "user-id",
        ...props,
        status: UserStatus.VERIFIED,
      },
      new VerifiedUserState(),
    );

    user.block();

    expect(user.getStatus()).toBe(UserStatus.BLOCKED);
  });
});