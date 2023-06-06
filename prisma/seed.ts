/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// seed.ts

import {
    PrismaClient,
    Product,
    ProductItem,
    User,
    ShopOrder,
    OrderLine,
} from '@prisma/client'
import { faker } from '@faker-js/faker'
import { createProductsWithCategories, createUser } from './helpers/products'

const prisma = new PrismaClient()

export async function clean() {
    await prisma.orderLine.deleteMany()
    await prisma.shoppingCartItem.deleteMany()
    await prisma.shoppingCart.deleteMany()
    await prisma.productConfiguration.deleteMany()
    await prisma.userReview.deleteMany()
    await prisma.userAddress.deleteMany()
    await prisma.shopOrder.deleteMany()
    await prisma.orderStatus.deleteMany()
    await prisma.user.deleteMany()
    await prisma.productItem.deleteMany()
    await prisma.variationOption.deleteMany()
    await prisma.variation.deleteMany()
    await prisma.product.deleteMany()
    await prisma.productCategory.deleteMany()
    await prisma.address.deleteMany()
    await prisma.shippingMethod.deleteMany()
}

export function randomNumber(min = 0, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function sampleArray<T>(arr: Array<T>) {
    const count = randomNumber(1, arr.length - 1)

    return Array(count)
        .fill(null)
        .map(() => arr[randomNumber(0, arr.length - 1)])
}

async function seed() {
    try {
        await clean()
        const products = await createProductsWithCategories()
        const user = await createUser()

        await prisma.shopOrder.create({
            data: {
                order_total: Math.random() * 100,
                shipping_address: {
                    create: {
                        address_line1: faker.location.streetAddress(),
                        city: faker.location.city(),
                        postal_code: faker.location.zipCode(),
                        region: faker.location.secondaryAddress(),
                        street_number: faker.location.street(),
                    },
                },
                order_date: new Date(),
                shipping_method: {
                    create: {
                        name: 'DHL',
                        price: 100,
                    },
                },
                order_status: {
                    create: {
                        status: 'processing',
                    },
                },
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                order_lines: {
                    create: sampleArray(products).map((product) => ({
                        quantity: 2,
                        price: 200,
                        product_item: {
                            create: {
                                price: 200,
                                product_image: faker.image.url(),
                                quantity_in_stock: 5,
                                SKU: 'JSK-232',
                                product: {
                                    connect: {
                                        id: products[
                                            Math.floor(
                                                Math.random() * products.length
                                            )
                                        ].id,
                                    },
                                },
                            },
                        },
                    })),
                },
            },
            include: {
                user: true,
            },
        })

        console.log('Data seeding completed.')
    } catch (error) {
        console.error('Error seeding data:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seed()
    .then(() => {
        console.log('seed complete')
    })
    .catch(() => {
        console.log('seed failed')
    })
