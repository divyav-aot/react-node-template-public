import { Request, Response } from 'express'
import { UserServices } from '../services/user.service'
import { InvalidDataError } from '../common/error'
import { Constants } from '../common/constants'
import { apiLogging } from '../common/decorators'

export class UserController {
  @apiLogging
  public async createUser (req: Request, res: Response) {
    const userServices: UserServices = new UserServices()
    const reqUser = req.body
    const newUser = await userServices.createOrUpdateUser(reqUser.firstName, reqUser.middleName, reqUser.lastName, reqUser.dateOfBirth)

    if (newUser !== null && typeof (newUser) !== 'undefined') {
      res.status(Constants.OK)
        .json({
          message: Constants.SUCCESSFULLY_CREATED_MESSAGE,
          user: newUser
        })
    } else {
      throw new InvalidDataError(Constants.INVALID_DATA)
    }
  }

  @apiLogging
  public async findAllUsers (req: Request, res: Response) {
    const userServices: UserServices = new UserServices()
    const users = await userServices.findAllUsers()

    if (users !== null && typeof (users) !== 'undefined') {
      res.status(Constants.OK)
        .json({
          message: Constants.USER_LIST,
          users
        })
    } else {
      throw new InvalidDataError(Constants.INVALID_DATA)
    }
  }

  @apiLogging
  public async updateUser (req: Request, res: Response) {
    const userServices: UserServices = new UserServices()
    const reqUser = req.body
    const userId = req.params.userId
    const user = await userServices.findByUserId(userId)

    if (user !== null && typeof (user) !== 'undefined') {
      await userServices.createOrUpdateUser(reqUser.firstName, reqUser.middleName, reqUser.lastName, reqUser.dateOfBirth)

      res.status(Constants.OK)
        .json({
          message: Constants.SUCCESSFULLY_UPDATED_MESSAGE,
          user
        })
    } else {
      throw new InvalidDataError(Constants.INVALID_DATA)
    }
  }

  @apiLogging
  public async deleteUser (req: Request, res: Response) {
    const userServices: UserServices = new UserServices()
    const userId = req.params.userId
    const status = await userServices.deleteByUserId(userId)
    if (status.affected === 1) {
      res.status(Constants.OK)
        .json({
          message: Constants.SUCCESSFULLY_DELETED_MESSAGE
        })
    } else {
      throw new InvalidDataError(Constants.INVALID_DATA)
    }
  }

  @apiLogging
  public async findUserById (req: Request, res: Response) {
    const userServices: UserServices = new UserServices()
    const userId = req.params.userId
    const user = await userServices.findByUserId(userId)

    if (user !== null && typeof (user) !== 'undefined') {
      res.status(Constants.OK)
        .json({
          message: Constants.USER_FOUND_MESSAGE,
          user
        })
    } else {
      throw new InvalidDataError(Constants.INVALID_DATA)
    }
  }
}
