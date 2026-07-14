import { describe, expect, it } from "vitest";
import { BcryptHashProvider } from "../../hashProvider.js";

describe('Integration test for hash provider', () => {
  it('should hash a value', async () => {
    const provider = new BcryptHashProvider()
    const password = "123456789"
    const hash = await provider.hash(password)
    expect(hash).not.toBe(password)
    expect(hash.length).toBeGreaterThan(20)
  })

  it('should generate a valid bcrypt hash', async () => {
    const provider = new BcryptHashProvider()
    const password = "123456789"
    const hash = await provider.hash(password)
    const matches = await provider.compare(password, hash)
    expect(matches).toBe(true)
  })
})