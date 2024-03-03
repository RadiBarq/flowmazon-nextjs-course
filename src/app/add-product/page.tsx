import { prismaBase } from '@/lib/db/prisma'
import { redirect } from 'next/navigation'
import React from 'react'
import FormSubmitButton from '../../components/FormSubmitButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

export const metadata = {
  title: 'Add Product - Flowmazon',
}

async function addProduct(formData: FormData) {
  'use server'
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product')
  }
  const name = formData.get('name')?.toString()
  const description = formData.get('description')?.toString()
  const imageUrl = formData.get('imageUrl')?.toString()
  const price = Number(formData.get('price') || 0)

  if (!name || !description || !imageUrl || !price) {
    throw Error('Missing required fields')
  }

  for (let i = 0; i < 50; i++) {
    await prismaBase.product.create({
      data: { name, description, imageUrl, price },
    })
  }

  redirect('/')
}

export default async function AddProductPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product')
  }

  return (
    <div>
      <h1 className="text-lg text mb-3 font-bold">Add product</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          placeholder="Name"
          className="mb-3 w-full input input-bordered"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="textarea-bordered textarea mb-3 w-full"
        />
        <input
          required
          name="imageUrl"
          placeholder="Image URL"
          type="url"
          className="mb-3 w-full input input-bordered"
        />
        <input
          required
          name="price"
          placeholder="Price"
          type="number"
          className="mb-3 w-full input input-bordered"
        />
        <FormSubmitButton className="btn-block" type="submit">
          Add product
        </FormSubmitButton>
      </form>
    </div>
  )
}
