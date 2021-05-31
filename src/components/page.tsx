import React, { FunctionComponent } from 'react'
import { Container } from './container'

export const Page: FunctionComponent = ({ children }) => (
  <Container className="page">{children}</Container>
)
