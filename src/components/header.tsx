import React, { FunctionComponent } from 'react'

import { Container } from './container'

export const Header: FunctionComponent = ({ children }) => (
  <header className="navbar navbar-light">
    <Container>{children}</Container>
  </header>
)
