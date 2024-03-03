'use client'
import React, { ComponentProps } from 'react'
import { useFormStatus } from 'react-dom'

type FormSubmitButtonProps = {
  children: React.ReactNode
  className?: string
} & ComponentProps<'button'>

export default function FormSubmitButton({
  children,
  className,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <button
      {...props}
      typeof="submit"
      className={`btn btn-primary ${className}`}
      disabled={pending}
    >
      {pending && <span className="loading loading-spinner"></span>}
      {children}
    </button>
  )
}
