import { Router } from 'express'
import { validate } from '../utils/validate'
import { loginSchema, signupSchema } from '../validators/auth.validator'
import {
    loginUser,
    refreshToken,
    registerUser,
} from '../controllers/auth.controllers'

//import { authenticateToken } from '../middleware/authentication.middleware'

const router = Router()

router.post('/login', validate(loginSchema), loginUser)

router.post(`/signup`, validate(signupSchema), registerUser)

router.post('/refresh', refreshToken)

router.post('/logout')

router.post('/forgot-password')

export default router
