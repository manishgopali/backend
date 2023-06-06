import { NextFunction, Request, Response } from 'express'
import * as UserService from '../services/user.service'
import HttpStatusCode from 'http-status-codes'
import { User } from '@prisma/client'
export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await UserService.get()
        res.json(users)
    } catch (e) {
        next(e)
    }
}
export const getUsersById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userById = await UserService.getById(req.params.id)
        res.json(userById)
    } catch (e) {
        next(e)
    }
}

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await UserService.create(req.body as User)
        res.status(HttpStatusCode.CREATED).json(user)
    } catch (e) {
        next(e)
    }
}

// export const deleteUser = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const deletedUser = await UserService.deleteUser(req.params)
//         res.status(200).send(deletedUser)
//     } catch (err) {
//         next(err)
//     }
// }

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await UserService.deleteUser(Number(req.params.id))
        res.status(HttpStatusCode.NO_CONTENT).send()
    } catch (e) {
        next(e)
    }
}

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const updatedUser = await UserService.updateUser(
            Number(req.params.id),
            req.body
        )
        res.status(200).send(updatedUser)
    } catch (err) {
        next(err)
    }
}
