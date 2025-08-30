/* eslint-disable @typescript-eslint/no-require-imports */
import { User } from '../entities/user'
import { db } from '../connections/db'
const userLogger = require('../logger/logging')

export const UserRepository = db.getRepository(User).extend({

  async createOrUpdateUser (reqUser: User) {
    userLogger.debug('UserRepository.createUser() start')
    userLogger.info('UserRepository.createUser() method')
    const user = await this.manager.save(reqUser)
    userLogger.info('UserRepository.createUser() end')
    userLogger.debug('UserRepository.createUser() end')
    return user
  },

  async findAllUsers () {
    userLogger.debug('UserRepository.findAllUsers() start')
    userLogger.info('UserRepository.findAllUsers() method')
    const users = await this.manager.find(User)
    userLogger.info('UserRepository.findAllUsers() end')
    userLogger.debug('UserRepository.findAllUsers() end')
    return users
  },

  async findByUserId (userId:string) {
    userLogger.debug('UserRepository.findById() start')
    userLogger.info('UserRepository.findById() method')
    const user = await this.manager.findOneBy(User, { userId })
    userLogger.info('UserRepository.findById() end')
    userLogger.debug('UserRepository.findById() end')
    return user
  },

  async deleteByUserId (userId:string) {
    userLogger.debug('UserRepository.deleteById() start')
    userLogger.info('UserRepository.deleteById() method')
    const user = await this.manager.delete(User, { userId })
    userLogger.info('UserRepository.deleteById() end')
    userLogger.debug('UserRepository.deleteById() end')
    return user
  }
})
