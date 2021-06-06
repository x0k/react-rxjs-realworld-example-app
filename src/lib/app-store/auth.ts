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
import { ChangeFieldEventPayload } from 'lib/event'
import { isLocationWithFromState } from 'lib/router'
import {
  createRxStateFactory,
  StateOptions,
  StateSignals,
  StateHandlers,
} from 'lib/rx-store'
import {
  Path,
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'lib/models'

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

export type AuthSignals = {
  setUser: User
  navigate: NavigateEventPayload
}

export const createAuth = createRxStateFactory(
  (
    {
      events: { changeField$, signIn$, stop$ },
      signals: { navigate, setUser },
      sources: { navigate$ },
      store,
    }: StateOptions<AuthState, AuthEvents, AuthSources> &
      StateSignals<AuthSignals>,
    api: UserAndAuthenticationApi
  ): StateHandlers<AuthState> => {
    const catchGenericAjaxError =
      createGenericAjaxErrorCatcherForReLoadableData(store)
    return [
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
              isLocationWithFromState(location)
                ? location.state.from
                : Path.Feed
            )
          }),
          mapTo(initialAuthState),
          catchGenericAjaxError
        )
      ),
      takeUntil(stop$),
    ]
  }
)
