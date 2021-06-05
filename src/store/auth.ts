import { merge } from 'rxjs'
import {
  exhaustMap,
  map,
  mapTo,
  tap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators'
import { Update } from 'history'

import { LoginUser, User, UserAndAuthenticationApi } from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { ChangeFieldEventPayload } from 'lib/event'
import { isLocationWithFromState } from 'lib/router'
import { ObservableOf, SignalsOf } from 'lib/store-rx-store'
import { Store } from 'lib/store'

import { Path } from 'models/path'
import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'models/re-loadable-data'

import { NavigateEventPayload } from './navigation'

export type AuthState = LoginUser & ReLoadableData

export const initialAuthState: AuthState = {
  email: '',
  password: '',
  loading: false,
  errors: {},
}

export type AuthEvents = {
  changeField: ChangeFieldEventPayload<LoginUser>
  signIn: unknown
  stop: unknown
}

export type AuthSources = {
  navigate: Update
}

export type AuthSignals = SignalsOf<{
  setUser: User
  navigate: NavigateEventPayload
}>

export function createAuth(
  store: Store<AuthState>,
  {
    changeField$,
    signIn$,
    stop$,
    navigate$,
  }: ObservableOf<AuthEvents & AuthSources>,
  { navigate, setUser }: AuthSignals,
  api: UserAndAuthenticationApi
) {
  const catchGenericAjaxError =
    createGenericAjaxErrorCatcherForReLoadableData(store)

  return createRxState(
    store,
    merge(
      changeField$.pipe(
        map(({ field, value }) => ({ ...store.state, [field]: value }))
      ),
      signIn$.pipe(
        map(() => ({
          ...store.state,
          loading: true,
        }))
      ),
      signIn$.pipe(
        exhaustMap(() => api.login({ body: { user: store.state } })),
        withLatestFrom(navigate$),
        tap(([{ user }, { location }]) => {
          setUser(user)
          navigate(
            isLocationWithFromState(location) ? location.state.from : Path.Feed
          )
        }),
        mapTo(initialAuthState),
        catchGenericAjaxError
      )
    ),
    takeUntil(stop$)
  )
}
