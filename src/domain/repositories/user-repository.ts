// abstração (Os módulos de alto nível dependem desta abstração/interface) isso é o D do SOLID

import { User } from "../entities/User.js"

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  createUser(user: User): Promise<User | null>
}