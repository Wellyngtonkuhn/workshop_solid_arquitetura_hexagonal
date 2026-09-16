import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Session } from "../domain/entities/Session.js";
import { ISessionRepository } from "../domain/repository/session-repository.js";
import { sessionsTable } from "@/shared/database/schema/session-table.js";

export class SessionDrizzleRepository implements ISessionRepository {
  constructor(
    private readonly db: NodePgDatabase
  ){} 
  
  async save(session: Session): Promise<void> {
    await this.db.insert(sessionsTable).values({
      user_id: session.propsData.userId,
      expires_at: session.propsData.expiresAt,
      refresh_token_hash: session.propsData.refreshTokenHash,
    }) 
  }
}