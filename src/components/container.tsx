import React, { ElementType } from 'react'
import clsx from 'clsx'

import { AsProp, ClassNameProp } from 'models/props'

export type ContainerProps<E extends ElementType> = ClassNameProp & AsProp<E>

export function Container<E extends ElementType>({
  className,
  as: Element = 'div',
  ...rest
}: ContainerProps<E>) {
  return <Element {...rest} className={clsx('container', className)} />
}
