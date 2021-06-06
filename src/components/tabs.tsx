import React, { FunctionComponent } from 'react'
import clsx from 'clsx'

import { ClassNameProp } from 'lib/props'

export const Tabs: FunctionComponent<ClassNameProp> = ({
  children,
  className,
}) => (
  <ul className={clsx('nav nav-pills feed-toggle outline-active', className)}>
    {children}
  </ul>
)
