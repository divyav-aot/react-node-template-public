/* eslint-disable @typescript-eslint/no-require-imports */
import 'reflect-metadata'
import { App } from './app'
const retailerLogger = require('../src/logger/logging')

const PORT = process.env.PORT

const app = new App().app
app.listen(PORT, () => {
  retailerLogger.info('Express server listening on port ' + PORT)
})
