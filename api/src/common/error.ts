import { Response } from 'express'

export class ErrorHandler {
  public handleValidationError (res:Response, name:string, message:string, statusCode:number, error:string) {
    res.status(statusCode).json({
      name,
      message,
      statusCode,
      error
    })
  }

  public handleExceptionError (res:Response, name:string, message:string, statusCode:number, error:string, err:Error) {
    res.status(statusCode).json({
      name,
      message,
      statusCode,
      error,
      details: err
    })
  }
}

export class InvalidDataError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'InvalidDataError'
  }
}
