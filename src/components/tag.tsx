import React, { ElementType } from 'react'
import clsx from 'clsx'

import { AsProp, ClassNameProp } from 'models/props'

export type TagProps<E extends ElementType> = AsProp<E> &
  ClassNameProp & {
    outline?: boolean
  }

export function Tag<E extends ElementType>({
  children,
  outline,
  className,
  as: Element = 'a',
  ...rest
}: TagProps<E>) {
  return (
    <Element
      {...rest}
      className={clsx(className, 'tag-default tag-pill', {
        'tag-outline': outline,
      })}
    >
      {children}
    </Element>
  )
}
