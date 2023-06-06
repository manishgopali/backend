/* eslint-disable @typescript-eslint/no-unsafe-call */
import { faker } from '@faker-js/faker'
import prisma from '../../src/libs/prisma'

export async function createProductsWithCategories() {
    const categories = await prisma.$transaction(
        Array(10)
            .fill(null)
            .map((_, i) => {
                return prisma.productCategory.create({
                    data: {
                        category_name: faker.commerce.productAdjective(),
                    },
                })
            })
    )

    const products = Array(10)
        .fill(null)
        .map(() => {
            return prisma.product.create({
                data: {
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    product_image: faker.image.url(),
                    category: {
                        connect: {
                            id: categories[
                                Math.floor(Math.random() * categories.length)
                            ].id,
                        },
                    },
                },
            })
        })

    return prisma.$transaction(products)
}

export async function createUser() {
    return prisma.user.create({
        data: {
            email: faker.person.fullName() + '@gmail.com',
            password: faker.string.uuid(),
        },
    })
}
