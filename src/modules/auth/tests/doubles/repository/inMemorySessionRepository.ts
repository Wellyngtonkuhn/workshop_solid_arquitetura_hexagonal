import { Session } from "@/modules/auth/domain/entities/Session.js";
import { ISessionRepository } from "@/modules/auth/domain/repository/session-repository.js";
import { randomUUID } from "crypto";

export class InMemorySessionRepository implements ISessionRepository{
  public sessions: Session[] = []

  async save(session: Session): Promise<void> {
    session.propsData.id = randomUUID()
    this.sessions.push(session)
  }
}