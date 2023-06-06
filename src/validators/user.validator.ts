import { z } from 'zod'
import { userAddressValidator } from './common.validator'

export const createUserBodySchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
        })
        .email('It is an email'),
    password: z.string({
        required_error: 'Password is required',
    }),
    is_admin: z.boolean().optional().default(false),
})

export const createUserSchema = z.object({
    body: createUserBodySchema,
})

export const updateUserBodySchema = z
    .object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Should be a valid email address')
            .optional(),
        password: z
            .string({
                required_error: 'Password is required',
            })
            .optional(),
        // Sometimes you may want custom validators, like this in case
        phone_number: z.string().optional(),
        addresses: userAddressValidator,
        is_admin: z.boolean().optional(),
    })
    .strict()

export const updateUserSchema = z.object({
    body: updateUserBodySchema,
})
