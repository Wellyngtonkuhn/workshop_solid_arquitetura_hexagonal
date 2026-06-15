// abstração (Os módulos de alto nível dependem desta abstração/interface) isso é o D do SOLID

import { User } from "../entities/User.js"

export interface CreateUserRepositoryInput {
  name: string
  age: number
  email: string
  password: string
  phoneNumber: string
  preferredMarketingChannel: string
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  createUser(body: CreateUserRepositoryInput): Promise<User>
}