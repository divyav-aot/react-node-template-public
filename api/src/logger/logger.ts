/* eslint-disable @typescript-eslint/no-unused-vars */
import { format, createLogger, transports } from 'winston'
import rTracer from 'cls-rtracer'
import DailyRotateFile from 'winston-daily-rotate-file'
const { timestamp, combine, printf } = format

function buildLogger () {
  const logFormat = printf(({ level, message, timestamp }) => {
    const rid = rTracer.id()
    return rid
      ? `${timestamp} ${level}: [request-id:${rid}] ${message}`
      : `${timestamp}: ${message}`
  })

  const options = {
    console: {
      level: process.env.LOG_LEVEL,
      handleExceptions: true,
      json: false,
      colorize: true
    }
  }

  /* const dailyRotateFile = new DailyRotateFile({
    level: process.env.LOG_LEVEL,
    filename: process.env.LOG_FILE_LOCATION,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    handleExceptions: true,
    json: true,
    maxSize: process.env.LOG_FILE_MAX_SIZE,
    maxFiles: process.env.LOG_FILE_MAX_FILES
  }) */

  const logger = createLogger({
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      format.errors({ stack: true }),
      logFormat),

    transports: [
      new transports.Console(options.console)
      // in case you need to log to a file, uncomment the below code
      // dailyRotateFile
    ],
    exitOnError: false
  })
  return logger
}

module.exports = buildLogger
