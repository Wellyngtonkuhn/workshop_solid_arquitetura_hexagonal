import { Session } from "../entities/Session.js"

export interface ISessionRepository {
  save(session: Session): Promise<void>
  // findByRefreshToken(refreshToken: string): Promise<void | null>
}