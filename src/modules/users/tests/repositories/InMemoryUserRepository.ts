import { randomUUID } from "crypto";
import { User } from "../../domain/entities/User.js";
import { UserRepository } from "../../domain/repositories/user-repository.js";

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = [];

  async save(user: User): Promise<User> {
    user.propsData.id = randomUUID()
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex(
      u => u.propsData.id === user.propsData.id
    );

    this.users[index] = user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(
      u => u.propsData.id === id
    ) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(
      u => u.propsData.email === email
    ) ?? null;
  }

  async findByPhoneNumber(phone: string): Promise<User | null> {
    return this.users.find(
      u => u.propsData.phoneNumber === phone
    ) ?? null;
  }
}