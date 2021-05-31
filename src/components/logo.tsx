import React, { FunctionComponent } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export const Logo: FunctionComponent<{
  title: React.ReactNode
  to: LinkProps['to']
}> = ({ title, to }) => (
  <Link className="navbar-brand" to={to}>
    {title}
  </Link>
)
