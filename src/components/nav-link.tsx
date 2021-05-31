import React, { FunctionComponent } from 'react'
import { NavLink as Link, NavLinkProps } from 'react-router-dom'

export const NavLink: FunctionComponent<NavLinkProps> = ({
  children,
  ...rest
}) => (
  <Link {...rest} className="nav-link">
    {children}
  </Link>
)
