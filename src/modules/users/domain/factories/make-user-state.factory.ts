import { UserStatus } from "../entities/User.js"
import { UserStateMap } from "../maps/user-state.map.js"
import { UserState } from "../states/user/user.state.js"

export class UserStateFactory {
  static create(status: UserStatus): UserState {
    const StateClass = UserStateMap[status]

    if (!StateClass) {
      throw new Error(`Invalid UserStatus: ${status}`)
    }

    return new StateClass()
  }
}