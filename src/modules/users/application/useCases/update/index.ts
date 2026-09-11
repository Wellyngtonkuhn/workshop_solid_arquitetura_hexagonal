import { UserRepository } from "@/modules/users/domain/repositories/user-repository.js"
import { UserCannotUpdateProfileError } from "@/modules/users/errors/cannot-update-profile.error.js"
import { UserNotFound } from "@/modules/users/errors/user-not-found.error.js"
import { UpdateUserInputDTO } from "./input.dto.js"


export class UpdateUser {
  constructor(
    private userRepository: UserRepository
  ){}

  async execute(id: string, body: UpdateUserInputDTO): Promise<void> {
    const user = await this.userRepository.findById(id)

    if(!user){
      throw new UserNotFound()
    }

    if(!user.canUpdateProfile()){
      throw new UserCannotUpdateProfileError()
    }

    user.updateProfile(body)

    await this.userRepository.update(user)
  }
}