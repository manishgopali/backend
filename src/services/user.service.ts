import Boom from '@hapi/boom'
import prisma from '../libs/prisma'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'

import { z } from 'zod'
import { updateUserBodySchema } from '../validators/user.validator'
import { exclude } from '../utils'

export const create = async (user: User) => {
    try {
        return await prisma.user.create({
            data: {
                ...user,
                password: await bcrypt.hash(user.password, 10),
            },
        })
    } catch (e: any) {
        if (
            e.code === 'P2002' &&
            e.meta?.target &&
            e.meta?.target[0] === 'email'
        ) {
            throw Boom.conflict('User with this email already exists')
        } else {
            throw e
        }
    }
}

export const get = async () => {
    return await prisma.user.findMany({
        select: { id: true, email: true, phone_number: true, Address: true },
    })
}

export const getById = async (id: string) => {
    try {
        return await prisma.user.findFirstOrThrow({
            select: {
                id: true,
                email: true,
                phone_number: true,
                Address: true,
            },
            where: { id: Number(id) },
        })
    } catch (error: any) {
        if (error.code === 'P2025') {
            throw Boom.notFound('user id  not found')
        } else {
            throw error
        }
    }
}

export const deleteUser = async (id: number) => {
    try {
        await prisma.user.delete({
            where: { id },
        })
    } catch (err: any) {
        if (err.code === 'P2025') {
            throw Boom.notFound(`User with id ${id} does not exist`)
        }
    }
}

export const updateUser = async (
    id: number,
    user: z.infer<typeof updateUserBodySchema>
) => {
    const { addresses, ...rest } = user

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            // TODO: hash the password later
            data: { ...rest },
            include: {
                Address: true,
            },
        })

        if (!addresses) return exclude(updatedUser, ['password'])

        const updatedAddresses = await Promise.all(
            addresses.map(async (address) => {
                if (address.id) {
                    return prisma.address.update({
                        where: { id: address.id },
                        data: address,
                    })
                }
                const newAddress = await prisma.address.create({
                    data: {
                        ...address,
                        id: undefined,
                        user: { connect: { id } },
                    },
                })
                return newAddress
            })
        )

        updatedUser.Address = updatedAddresses

        return exclude(updatedUser, ['password'])
    } catch (err: any) {
        if (err.code === 'P2025') {
            throw Boom.notFound(`User with id ${id} does not exist`)
        } else {
            throw err
        }
    }
}
export function remove(arg0: number) {
    throw new Error('Function not implemented.')
}
