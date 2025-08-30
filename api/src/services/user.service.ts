/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRepository } from '../repositories/user.repository'
import { User } from '../entities/user'

export class UserServices {
  public async createOrUpdateUser (firstName: string, middleName: string, lastName: string, dateOfBirth: any) {
    const newUser: User = new User()
    newUser.firstName = firstName
    newUser.middleName = middleName
    newUser.lastName = lastName
    newUser.dateOfBirth = dateOfBirth
    return await UserRepository.createOrUpdateUser(newUser)
  }

  public async findAllUsers () {
    return await UserRepository.findAllUsers()
  }

  public async findByUserId (userId: string) {
    return await UserRepository.findByUserId(userId)
  }

  public async deleteByUserId (userId: string) {
    return await UserRepository.deleteByUserId(userId)
  }
}
