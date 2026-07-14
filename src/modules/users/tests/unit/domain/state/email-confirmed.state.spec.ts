
import { describe, expect, it } from "vitest"
import { EmailConfirmedState } from "../../../../domain/states/user/email-confirmed-user.state.js"
import { VerifiedUserState } from "../../../../domain/states/user/verified-user.state.js"
import { BlockedUserState } from "../../../../domain/states/user/blocked-user.state.js"

describe("EmailConfirmedState", () => {

  const state = new EmailConfirmedState()

  it("Permissions", () => {
    expect(state.canLogin()).toBe(false)
    expect(state.canSendMessage()).toBe(false)
    expect(state.canUpdateProfile()).toBe(true)
  })

  it("should transition to VERIFIED", () => {
    expect(state.activate()).toBeInstanceOf(VerifiedUserState)
  })

  it("should transition to BLOCKED", () => {
    expect(state.block()).toBeInstanceOf(BlockedUserState)
  })

})