import React, { FunctionComponent, TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

import { FormControlSize } from './form-control'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: FormControlSize
}

export const Textarea: FunctionComponent<TextareaProps> = ({
  className,
  size,
  ...props
}) => <textarea className={clsx('form-control', className, size)} {...props} />
