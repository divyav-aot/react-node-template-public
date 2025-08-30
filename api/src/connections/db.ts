/* eslint-disable @typescript-eslint/no-require-imports */
import { DataSource } from 'typeorm'
const config = require('../../ormconfig')
const connectionsLogger = require('../logger/logging')

export const db = new DataSource(config)

try {
  (async () => {
    await db.initialize()
  })()
  connectionsLogger.info('Data source has been initialized!')
} catch (error) {
  connectionsLogger.error('Error during data source initialization', error)
}
