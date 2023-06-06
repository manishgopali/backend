import { NextFunction } from 'express'
import * as ProfileService from '../services/profile.service'
import HttpStatusCode from 'http-status-codes'
//import { RequestWithUserObject } from '../types'
import { Response } from 'express'
export const getProfile = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await ProfileService.get(req.user.userId)
        res.json(users)
    } catch (e) {
        next(e)
    }
}

export const updateProfile = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await ProfileService.update(req.user.userId, req.body)
        res.status(HttpStatusCode.CREATED).json(user)
    } catch (e) {
        next(e)
    }
}
