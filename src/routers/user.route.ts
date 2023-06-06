import { Router } from 'express'
import * as UserController from '../controllers/user.controller'
import {
    authenticateToken,
    isAdmin,
} from '../middleware/authentication.middleware'
import { validate } from '../utils/validate'
import { createUserSchema } from '../validators/user.validator'
// These APIS will be used by admin user for user management

const router = Router()
router.get('/', authenticateToken, isAdmin, UserController.getUsers)

router.get('/:id', authenticateToken, isAdmin, UserController.getUsersById)

router.post(
    '/',
    validate(createUserSchema),
    authenticateToken,
    isAdmin,

    UserController.createUser
)

router.patch(
    '/:id',
    validate(createUserSchema),
    authenticateToken,
    isAdmin,

    UserController.updateUser
)

router.delete('/:id', authenticateToken, isAdmin, UserController.deleteUser)

export default router
