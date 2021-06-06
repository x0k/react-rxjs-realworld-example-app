import React, { ElementType } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

import { AsProp, ClassNameProp } from 'lib/props'

export type TagProps<E extends ElementType> = AsProp<E> &
  ClassNameProp & {
    outline?: boolean
  }

export function Tag<E extends ElementType = typeof Link>({
  children,
  outline,
  className,
  as: Element = Link,
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
