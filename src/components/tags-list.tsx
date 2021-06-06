import React, { ElementType } from 'react'
import clsx from 'clsx'

import { AsProp, ClassNameProp } from 'lib/props'

export type TagsListProps<E extends ElementType> = ClassNameProp & AsProp<E>

export function TagsList<E extends ElementType>({
  className,
  as: Element = 'ul',
  ...rest
}: TagsListProps<E>) {
  return <Element {...rest} className={clsx(className, 'tag-list')} />
}
