import { getCart } from '@/lib/db/carts'
import CardEntry from './CartEntry'
import { formatPrice } from '@/lib/format'

export const metadata = {
  title: 'Your Cart - Flowmazon',
}

export default async function CartPage() {
  const cart = await getCart()
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((cartItem) => (
        <CardEntry cartItem={cartItem} key={cartItem.id} />
      ))}
      {!cart?.items.length && <p>Your cart is empty.</p>}
      <div className="flex flex-col items-end sm:items-center">
        <p>Total: {formatPrice(cart?.subtotal || 0)}</p>
        <button className="btn btn-primary sm:w-[200px]">Checkout</button>
      </div>
    </div>
  )
}
