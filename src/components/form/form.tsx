import React, { FunctionComponent } from 'react'
import clsx from 'clsx'

import './form.css'

export const Form: FunctionComponent<
  React.FormHTMLAttributes<HTMLFormElement>
> = ({ className, children, ...props }) => (
  <form {...props} className={clsx('my-form', className)}>
    <fieldset>{children}</fieldset>
  </form>
)
