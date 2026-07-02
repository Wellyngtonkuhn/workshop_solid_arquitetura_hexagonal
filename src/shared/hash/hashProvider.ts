import { HashProvider } from "../../modules/users/application/ports/hash-provider.js";
import bcrypt from "bcrypt"

export class BcryptHashProvider implements HashProvider {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}