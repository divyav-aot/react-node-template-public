/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Constants } from './constants'
import { ErrorHandler, InvalidDataError } from './error'
import { LoggerFormat } from './logger.format'
const logger = require('../logger/logging')

export function apiLogging (target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const errorHandler:ErrorHandler = new ErrorHandler()
  const loggerFormat: LoggerFormat = new LoggerFormat()
  const method = descriptor.value
  const className = target.constructor.name

  descriptor.value = async function (...args: any[]) {
    // destructure args
    const req = args[0]
    const res = args[1]

    // add logging and validation
    try {
      logger.debug(loggerFormat.prepareLoggerMessageFormat(`${className}.${propertyName}() start`, req.originalUrl))
      logger.info(loggerFormat.prepareLoggerMessageFormat(`${className}.${propertyName}() method`, req.originalUrl))
      await method.apply(this, args)
      logger.info(loggerFormat.prepareLoggerMessageFormat(`Response from ${className}.${propertyName}() is`, res.statusCode))
      logger.debug(loggerFormat.prepareLoggerMessageFormat(`${res.get('X-Response-Time')} ${className}.${propertyName}() end`, req.originalUrl))
    } catch (error) {
      if (error instanceof InvalidDataError) {
        errorHandler.handleValidationError(res, Constants.CREATE_USER_METHOD_NAME, Constants.INVALID_DATA, Constants.NOT_FOUND, Constants.CREATE_USER_METHOD_NAME)
      } else {
        errorHandler.handleExceptionError(res, Constants.CREATE_USER_METHOD_NAME, (error as Error).message, Constants.INTERNAL_SERVER_ERROR, Constants.INTERNAL_SERVER_EXCEPTION, error)
        logger.error(loggerFormat.prepareLoggerMessageFormat(`Exception occured in ${className}.${propertyName}() method `, JSON.stringify(error)))
      }
    }
  }

  return descriptor
}
