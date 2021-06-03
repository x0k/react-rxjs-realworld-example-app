import { merge, Observable, of, Subject } from 'rxjs'
import {
  catchError,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  mapTo,
  tap,
} from 'rxjs/operators'

import { LoginUser, User, UserResponse } from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { isNull, isPresent } from 'lib/types'
import { State } from 'lib/state'
import { userAndAuthenticationApi } from 'lib/api'
import { injectStore } from 'lib/store-rx-inject'
import { createMemoryStore } from 'lib/store'

import { GenericAjaxError } from 'models/errors'
import { Path } from 'models/path'

import { token$, tokenSet } from './token'
import { navigationNavigate } from './navigation'

export enum UserStatus {
  Unknown = 'unknown',
  LogIn = 'logIn',
  Authorized = 'authorized',
  Unauthorized = 'unauthorized',
}

export type UserStates =
  | State<UserStatus.Unknown>
  | State<UserStatus.LogIn>
  | State<UserStatus.Authorized, { user: User }>
  | State<UserStatus.Unauthorized, { error?: GenericAjaxError }>

export const userLogIn = new Subject<LoginUser>()
export const userLogOut = new Subject()
export const userSet = new Subject<User>()

const userResponseToState = (
  observable: Observable<UserResponse>
): Observable<UserStates> =>
  observable.pipe(
    map(({ user }) => ({
      type: UserStatus.Authorized,
      user,
    })),
    catchError((error: GenericAjaxError, caught) =>
      merge(
        caught,
        of<UserStates>({
          type: UserStatus.Unauthorized,
          error,
        })
      )
    )
  )

const store = createMemoryStore<UserStates>({ type: UserStatus.Unknown })

export const user$ = createRxState(
  store,
  merge<UserStates>(
    userLogIn.pipe(map((data) => ({ type: UserStatus.LogIn, data }))),
    userLogIn.pipe(
      exhaustMap((user) => userAndAuthenticationApi.login({ body: { user } })),
      userResponseToState
    ),
    userLogOut.pipe(
      tap(() => navigationNavigate.next(Path.Feed)),
      mapTo({ type: UserStatus.Unauthorized })
    ),
    userSet.pipe(map((user) => ({ type: UserStatus.Authorized, user }))),
    token$.pipe(
      filter(isPresent),
      injectStore(store),
      filter(
        ([token, state]) =>
          !(state.type === UserStatus.Authorized && state.user.token === token)
      ),
      exhaustMap(() => userAndAuthenticationApi.getCurrentUser()),
      userResponseToState
    ),
    token$.pipe(filter(isNull), mapTo({ type: UserStatus.Unauthorized }))
  ),
  tap((state) => {
    if (state.type === UserStatus.Authorized) {
      tokenSet.next(state.user.token)
    } else if (state.type === UserStatus.Unauthorized) {
      tokenSet.next(null)
    }
  })
)

export const isNotUnauthorized$ = user$.pipe(
  map((state) => state.type !== UserStatus.Unauthorized)
)

export const isAuthorized$ = user$.pipe(
  map((state) => state.type === UserStatus.Authorized),
  distinctUntilChanged()
)
