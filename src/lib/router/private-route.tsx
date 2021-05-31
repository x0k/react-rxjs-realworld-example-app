import React, { ComponentProps, createElement, FunctionComponent } from 'react'
import { Route } from 'react-router-dom'

import { Redirect, RedirectProps } from './redirect'

export type PrivateRouteProps = ComponentProps<typeof Route> & {
  redirect: RedirectProps
  open: boolean
}

export const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({
  element,
  open,
  redirect,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      element={open ? element : createElement(Redirect, redirect)}
    />
  )
}
