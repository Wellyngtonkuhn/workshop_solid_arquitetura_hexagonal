import "dotenv/config";
import { describe, expect, it } from "vitest";
import { JwtTokenProvider } from "./index.js";

describe('Token Provider', () => {
  const jwtProvider = new JwtTokenProvider()
  it('should create a valid token  jwt', () => {
    const userId = '123456789'
    const token = jwtProvider.sign({sub: userId, purpose: 'authentication'}, 1)
    expect(token).toBeTypeOf("string")

    const payload = jwtProvider.verify(token)
    expect(payload.sub).toBe(userId)
  })

  it('should verify a jwt token', () => {
    const userId = '123456789'
    const token = jwtProvider.sign({ sub: userId, purpose: 'email_confirmation'}, 1)
    expect(token).toBeTypeOf("string")

    const payload = jwtProvider.verify(token)
    expect(payload.sub).toBe(userId)
  })

  it("should throw when token is invalid", () => {
    expect(() => jwtProvider.verify("token-invalido")).toThrow()
  })
})