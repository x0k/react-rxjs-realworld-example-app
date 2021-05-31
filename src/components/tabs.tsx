import React, { FunctionComponent } from 'react'

export const Tabs: FunctionComponent = ({ children }) => (
  <ul className="feed-toggle nav nav-pills outline-active">{children}</ul>
)
