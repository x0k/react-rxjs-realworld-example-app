import React, { lazy, Suspense, useCallback } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { useRxState } from 'lib/store-rx-state'
import { PrivateRoute, RedirectRoute } from 'lib/router'

import { Path } from 'models/path'

import { Spinner } from 'components/spinner'

import { isNotUnauthorized$ } from 'store/user'

const HomePage = lazy(() => import('pages/home'))
const NotMachPage = lazy(() => import('pages/not-match'))
const GlobalFeedPage = lazy(() => import('pages/global-feed'))
const YourFeedPage = lazy(() => import('pages/your-feed'))
const FeedByTagPage = lazy(() => import('pages/feed-by-tag'))
const LoginPage = lazy(() => import('pages/login'))
const RegistrationPage = lazy(() => import('pages/registration'))
const ProfilePage = lazy(() => import('pages/profile'))
const ProfileArticlesPage = lazy(() => import('pages/profile-articles'))
const ProfileFavoriteArticlesPage = lazy(
  () => import('pages/profile-favorite-articles')
)
const SettingsPage = lazy(() => import('pages/settings'))
const EditorPage = lazy(() => import('pages/editor'))
const EditorCreatePage = lazy(() => import('pages/editor-create'))
const EditorUpdatePage = lazy(() => import('pages/editor-update'))
const ArticlePage = lazy(() => import('pages/article'))

const toLogin = { to: Path.Login }

const toHome = { to: Path.Home, replace: true }

export function AppRoutes() {
  const isNotUnauthorized = useRxState(isNotUnauthorized$)
  const toFeed = useCallback(
    (nav: ReturnType<typeof useNavigate>) =>
      nav(isNotUnauthorized ? Path.YourFeed : Path.GlobalFeed),
    [isNotUnauthorized]
  )
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path={Path.Home} element={<HomePage />}>
          <RedirectRoute path="/" to={toFeed} replace />
          <Route path={Path.GlobalFeed} element={<GlobalFeedPage />} />
          <PrivateRoute
            open={isNotUnauthorized}
            path={Path.YourFeed}
            element={<YourFeedPage />}
            redirect={toLogin}
          />
          <Route path={Path.FeedByTag} element={<FeedByTagPage />} />
        </Route>
        <PrivateRoute
          open={!isNotUnauthorized}
          path={Path.Login}
          element={<LoginPage />}
          redirect={toHome}
        />
        <PrivateRoute
          open={!isNotUnauthorized}
          path={Path.Registration}
          element={<RegistrationPage />}
          redirect={toHome}
        />
        <Route path={Path.Profile} element={<ProfilePage />}>
          <RedirectRoute path="/" to={Path.ProfileArticles} replace />
          <Route
            path={Path.ProfileArticles}
            element={<ProfileArticlesPage />}
          />
          <Route
            path={Path.ProfileFavorites}
            element={<ProfileFavoriteArticlesPage />}
          />
        </Route>
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
