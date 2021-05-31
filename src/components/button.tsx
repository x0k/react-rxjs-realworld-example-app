import React, { FunctionComponent } from 'react'
import clsx from 'clsx'

export enum ButtonVariant {
  Primary = 'btn-primary',
  Secondary = 'btn-secondary',
  OutlineSecondary = 'btn-outline-secondary',
  OutlinePrimary = 'btn-outline-primary',
  OutlineDanger = 'btn-outline-danger',
}

export enum ButtonSize {
  Small = 'btn-sm',
  Large = 'btn-lg',
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button: FunctionComponent<ButtonProps> = ({
  type,
  className,
  children,
  variant,
  size = ButtonSize.Small,
  ...props
}) => (
  <button
    className={clsx('btn', variant, size, className)}
    type={type}
    {...props}
  >
    {children}
  </button>
)
