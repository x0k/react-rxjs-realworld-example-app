import React, { AnchorHTMLAttributes, FunctionComponent } from 'react'
import clsx from 'clsx'

export type NavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean
}

export const NavLink: FunctionComponent<NavLinkProps> = ({
  children,
  className,
  active,
  ...rest
}) => (
  <a {...rest} className={clsx('nav-link', className, { active })}>
    {children}
  </a>
)
