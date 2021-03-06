import React, { Suspense } from 'react'

import { Path, APP_NAME } from 'lib/models'

import { Header } from 'components/header'
import { Logo } from 'components/logo'
import { Spinner } from 'components/spinner'

import { NavBarContainer } from 'containers/navbar'

import { AppRoutes } from './routes'

import './app.css'

export function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Header>
        <Logo title={APP_NAME} to={Path.Feed} />
        <NavBarContainer />
      </Header>
      <AppRoutes />
    </Suspense>
  )
}
