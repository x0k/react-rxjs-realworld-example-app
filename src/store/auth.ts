import { merge, Subject } from 'rxjs'
import {
  exhaustMap,
  map,
  mapTo,
  tap,
  withLatestFrom,
  takeUntil,
} from 'rxjs/operators'

import { LoginUser } from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { userAndAuthenticationApi } from 'lib/api'
import { ChangeFieldEventPayload } from 'lib/event'
import { isLocationWithFromState } from 'lib/router'
import { createMemoryStore } from 'lib/store'

import { Path } from 'models/path'
import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'models/re-loadable-data'

import { userSet } from './user'
import { navigation$, navigationPush } from './navigation'

export type AuthState = LoginUser & ReLoadableData

export const authChangeField = new Subject<ChangeFieldEventPayload<LoginUser>>()

export const authSignIn = new Subject()

export const authCleanup = new Subject()

const initialState: AuthState = {
  email: '',
  password: '',
  loading: false,
  errors: {},
}

const store = createMemoryStore(initialState)

const catchGenericAjaxError =
  createGenericAjaxErrorCatcherForReLoadableData(store)

export const auth$ = createRxState(
  store,
  merge(
    authChangeField.pipe(
      map(({ field, value }) => ({ ...store.state, [field]: value }))
    ),
    authSignIn.pipe(
      map(() => ({
        ...store.state,
        loading: true,
      }))
    ),
    authSignIn.pipe(
      exhaustMap(() =>
        userAndAuthenticationApi.login({ body: { user: store.state } })
      ),
      tap(({ user }) => userSet.next(user)),
      withLatestFrom(navigation$),
      tap(([, { location }]) =>
        navigationPush.next(
          isLocationWithFromState(location) ? location.state.from : Path.Home
        )
      ),
      mapTo(initialState),
      catchGenericAjaxError
    )
  ),
  takeUntil(authCleanup)
)
