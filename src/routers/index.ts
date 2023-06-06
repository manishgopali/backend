import userRoutes from './user.route'
import authRoutes from './auth.route'
import { Router } from 'express'
import profileRoute from './profile.route'

const router = Router()

router.use('/users', userRoutes)
router.use('/auth', authRoutes)
router.use('/profile', profileRoute)

export default router
