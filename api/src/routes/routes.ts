/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { validate, ValidationError } from 'express-validation'
import validations from './validations/validator'
import { LoggerFormat } from '../common/logger.format'
import { ErrorHandler } from '../common/error'
import { Constants } from '../common/constants'
import { RoutesConstants } from '../common/routes.constants'
import { UserController } from '../controllers/userController'
const retailerLogger = require('../logger/logging')

export class Routes {
  private userController: UserController

  constructor () {
    this.userController = new UserController()
  }

  public routes (app:any): void {
    retailerLogger.info('Routes.routes() start')
    const errorHandler:ErrorHandler = new ErrorHandler()
    const loggerFormat:LoggerFormat = new LoggerFormat()

    // This "health check" route is used by OpenShift to verify if the server is up.
    app.route(RoutesConstants.HEALTH_ENDPOINT).get((_req:Request, resp: Response) => {
      resp.status(Constants.OK).send({ message: Constants.SUCCESS_MESSAGE })
    })

    app.route(RoutesConstants.ALL_USERS_API)
      .get(this.userController.findAllUsers)

    app.route(RoutesConstants.USER_BY_ID_API)
      .get(validate(validations.findOrDeleteUser), this.userController.findUserById)
      .put(validate(validations.updateUser), this.userController.updateUser)
      .delete(validate(validations.findOrDeleteUser), this.userController.deleteUser)

    app.route(RoutesConstants.USER_API)
      .post(validate(validations.createUser), this.userController.createUser)

    app.use(function (err: Error, req: any, res: Response<any, Record<string, any>>, next: any) {
      if (err instanceof ValidationError) {
        retailerLogger.error(loggerFormat.prepareLoggerMessageFormat('Validation Error', JSON.stringify(err)))
        return res.status(err.statusCode).json(err)
      }
      if (err instanceof SyntaxError) {
        retailerLogger.error(loggerFormat.prepareLoggerMessageFormat('Syntax Error', JSON.stringify(err)))
        return errorHandler.handleExceptionError(res, Constants.ROUTES_METHOD_NAME, Constants.SYNTAX_ERROR, Constants.BAD_REQUEST, err.message, err)
      }
      return res.status(Constants.INTERNAL_SERVER_ERROR).json(err)
    })
  }
}
