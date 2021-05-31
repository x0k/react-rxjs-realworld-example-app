import React, { FunctionComponent } from 'react'
import type { RouteProps } from 'react-router'
import { Route } from 'react-router-dom'

import { Redirect, RedirectProps } from './redirect'

export type RedirectRouteProps = Omit<RouteProps, 'element'> & RedirectProps

export const RedirectRoute: FunctionComponent<RedirectRouteProps> = ({
  to,
  replace,
  ...rest
}) => {
  return <Route {...rest} element={<Redirect to={to} replace={replace} />} />
}
