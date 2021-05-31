import { merge, of, Subject } from 'rxjs'
import {
  catchError,
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

import { Errors, GenericAjaxError } from 'models/errors'
import { Path } from 'models/path'

import { userSet } from './user'
import { navigation$, navigationPush } from './navigation'

export type AuthState = LoginUser & {
  loading: boolean
  errors: Errors
}

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
      catchError((error: GenericAjaxError, caught) =>
        merge(
          caught,
          of({
            ...store.state,
            errors: error.response.errors,
            loading: false,
          })
        )
      )
    )
  ),
  takeUntil(authCleanup)
)
