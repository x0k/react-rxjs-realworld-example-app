import React from 'react'
import clsx from 'clsx'

import { ChildrenProp, ClassNameProp } from 'lib/props'

export type RowProps = ClassNameProp & ChildrenProp

export function Row({ className, children }: RowProps) {
  return <div className={clsx('row', className)}>{children}</div>
}
