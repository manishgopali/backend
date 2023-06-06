import { z } from 'zod'
import prisma from '../libs/prisma'
import { updateProfileBodySchema } from '../validators/profile.validator'
import { exclude } from '../utils'

export const get = async (id: number) => {
    return await prisma.user.findFirstOrThrow({
        select: { id: true, Address: true, email: true, phone_number: true },
        where: { id },
    })
}

export const update = async (
    id: number,
    user: z.infer<typeof updateProfileBodySchema>
) => {
    const { addresses, ...rest } = user
    const updatedUser = await prisma.user.update({
        where: { id },
        data: rest,
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
}
