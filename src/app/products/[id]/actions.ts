'use server'

import { createCart, getCart } from '@/lib/db/carts'
import { prismaBase } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'

export async function incrementProductQuantity(productId: string) {
  const cart = (await getCart()) ?? (await createCart())
  const cartItem = cart.items.find((item) => item.productId === productId)

  if (cartItem) {
    await prismaBase.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: { increment: 1 } },
    })
  } else {
    await prismaBase.cartItem.create({
      data: { productId, quantity: 1, cartId: cart.id },
    })
  }

  revalidatePath('/products/[id]')
}
