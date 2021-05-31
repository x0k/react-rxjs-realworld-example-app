import React, { FunctionComponent } from 'react'

export const NavBar: FunctionComponent = ({ children }) => (
  <ul className="nav navbar-nav pull-xs-right">{children}</ul>
)
