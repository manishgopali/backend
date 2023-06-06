import { config } from 'dotenv'
import cors from 'cors'
import express, { Request, Response } from 'express'
import crypto from 'crypto'
import userRoutes from '../routers/user.route'
import routes from '../routers/index'
import * as ErrorMiddlewares from '../middleware/errors.middleware'
import cookieParser from 'cookie-parser'

config()

const aVAr = express()

console.log('Hello this is me')
aVAr.use(cookieParser())
aVAr.use(express.json())
aVAr.use(express.urlencoded({ extended: true }))
aVAr.use(cors())
aVAr.use('/api', routes)

aVAr.use(ErrorMiddlewares.methodNotAllowed)
aVAr.use(ErrorMiddlewares.genericErrorHandler)

export default aVAr
