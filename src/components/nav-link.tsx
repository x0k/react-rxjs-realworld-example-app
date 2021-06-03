import React, { FunctionComponent } from 'react'
import { NavLink as Link, NavLinkProps as LinkProps } from 'react-router-dom'
import clsx from 'clsx'

export type NavLinkProps = LinkProps & {
  active?: boolean
}

export const NavLink: FunctionComponent<NavLinkProps> = ({
  children,
  className,
  active,
  activeClassName = 'active',
  ...rest
}) => (
  <Link
    {...rest}
    activeClassName={active !== undefined ? '' : activeClassName}
    className={clsx('nav-link', className, { [activeClassName]: active })}
  >
    {children}
  </Link>
)
