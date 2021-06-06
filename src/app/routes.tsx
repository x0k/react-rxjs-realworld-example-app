import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { PrivateRoute } from 'lib/router'
import { useRxState } from 'lib/rx-store-react'
import { Path } from 'lib/models'

import { Spinner } from 'components/spinner'

import { isNotUnauthorized$ } from 'app-store'

const FeedPage = lazy(() => import('pages/feed'))
const NotMachPage = lazy(() => import('pages/not-match'))
const LoginPage = lazy(() => import('pages/login'))
const RegistrationPage = lazy(() => import('pages/registration'))
const ProfilePage = lazy(() => import('pages/profile'))
const SettingsPage = lazy(() => import('pages/settings'))
const EditorPage = lazy(() => import('pages/editor'))
const EditorCreatePage = lazy(() => import('pages/editor-create'))
const EditorUpdatePage = lazy(() => import('pages/editor-update'))
const ArticlePage = lazy(() => import('pages/article'))

const toLogin = { to: Path.Login }

const toFeed = { to: Path.Feed, replace: true }

export function AppRoutes() {
  const isNotUnauthorized = useRxState(isNotUnauthorized$)
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path={Path.Feed} element={<FeedPage />} />
        <PrivateRoute
          open={!isNotUnauthorized}
          path={Path.Login}
          element={<LoginPage />}
          redirect={toFeed}
        />
        <PrivateRoute
          open={!isNotUnauthorized}
          path={Path.Registration}
          element={<RegistrationPage />}
          redirect={toFeed}
        />
        <Route path={Path.Profile} element={<ProfilePage />} />
        <PrivateRoute
          open={isNotUnauthorized}
          path={Path.Settings}
          element={<SettingsPage />}
          redirect={toLogin}
        />
        <PrivateRoute
          open={isNotUnauthorized}
          path={Path.Editor}
          element={<EditorPage />}
          redirect={toLogin}
        >
          <Route path={Path.EditorCreate} element={<EditorCreatePage />} />
          <Route path={Path.EditorSlug} element={<EditorUpdatePage />} />
        </PrivateRoute>
        <Route path={Path.Article} element={<ArticlePage />} />
        <Route path="*" element={<NotMachPage />} />
      </Routes>
    </Suspense>
  )
}
