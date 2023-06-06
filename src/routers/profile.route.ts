import { Router } from 'express'
import * as ProfileController from '../controllers/profile.controllers'
import { authenticateToken } from '../middleware/authentication.middleware'
import { validate } from '../utils/validate'
import { updateProfileSchema } from '../validators/profile.validator'

const router = Router()
router.get('/', authenticateToken, ProfileController.getProfile)

router.patch(
    '/',
    authenticateToken,
    validate(updateProfileSchema),
    ProfileController.updateProfile
)
export default router
