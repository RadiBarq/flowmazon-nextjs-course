'use server'
import { revalidatePath } from 'next/cache'
import { prismaBase } from '@/lib/db/prisma'
import { createCart, getCart } from '@/lib/db/carts'
export default async function setProduct(productId: string, quantity: number) {
  const cart = (await getCart()) ?? (await createCart())
  const cartItem = cart.items.find((item) => item.productId === productId)

  if (cartItem == null) {
    await prismaBase.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    })
    return
  }

  if (quantity === 0) {
    return await prismaBase.cart.update({
      where: { id: cart.id },
      data: { items: { delete: { id: cartItem.id } } },
    })
    //return await prisma.cartItem.delete({ where: { id: cartItem.id } })
  }

  await prismaBase.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity },
  })

  revalidatePath('/cart')
}
