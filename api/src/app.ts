/* eslint-disable @typescript-eslint/no-require-imports */
import express from 'express'
import { Routes } from './routes/routes'
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from '../swagger.json'
import cors from 'cors'
import rTracer from 'cls-rtracer'
const responseTime = require('response-time')

export class App {
  public app: express.Application
  public routePrv: Routes

  constructor () {
    // initializing express in this application
    this.app = express()
    // to capture response times of apis
    this.app.use(responseTime())
    // enabling cors
    const allowedOrigins = process.env.ALLOWED_ORIGINS
    console.log(allowedOrigins)
    this.app.use(cors({
      origin: function (origin, callback) {
        // bypass the requests with no origin (like curl requests, mobile apps, etc )
        if (!origin) return callback(null, true)

        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`
          return callback(new Error(msg), false)
        }
        return callback(null, true)
      }
    }))

    this.app.use(rTracer.expressMiddleware())
    // support application/json type post data
    this.app.use(express.json())
    // support application/x-www-form-urlencoded post data
    this.app.use(express.urlencoded({ extended: false }))
    // for routing the http request to controller
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

    this.routePrv = new Routes()
    this.routePrv.routes(this.app)
  }
}
