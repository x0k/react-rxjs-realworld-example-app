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
import { createRxStateFactory, StateOptions, StateHandlers } from 'lib/rx-store'
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
  navigation: Update
}

export type AuthSignals = {
  setUser: User
  navigate: NavigateEventPayload
}

export const createAuth = createRxStateFactory(
  (
    {
      events: { changeField$, signIn$, stop$, navigation$ },
      signals: { navigate$, setUser$ },
      store,
    }: StateOptions<AuthState, AuthEvents & AuthSources, AuthSignals>,
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
          withLatestFrom(navigation$),
          tap(([{ user }, { location }]) => {
            setUser$.next(user)
            navigate$.next(
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
