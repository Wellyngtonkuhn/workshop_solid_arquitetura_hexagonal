import { HashProvider } from "../../application/ports/hash-provider.js";
import bcrypt from "bcrypt"

export class BcryptHashProvider implements HashProvider {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10)
  }
}