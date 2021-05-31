import React, { FunctionComponent } from 'react'

export const ArticlesList: FunctionComponent = ({ children }) => (
  <ul className="articles-wrapper list-unstyled">{children}</ul>
)
