import { HashProvider } from "../../../../application/ports/hash-provider.js";

export class FakeHashProvider implements HashProvider {
  async hash(value: string): Promise<string> {
    return `hashed-${value}`
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return hash === `hashed-${value}`;
  }
}