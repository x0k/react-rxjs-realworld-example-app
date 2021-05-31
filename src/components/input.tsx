import React, { FunctionComponent } from 'react'
import clsx from 'clsx'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input: FunctionComponent<InputProps> = ({
  className,
  ...props
}) => <input {...props} className={clsx('form-control', className)} />
