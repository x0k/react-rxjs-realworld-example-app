import { merge, Observable, of } from 'rxjs'
import { catchError, exhaustMap, filter, map, mapTo, tap } from 'rxjs/operators'

import {
  LoginUser,
  User,
  UserAndAuthenticationApi,
  UserResponse,
} from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { isNull, isPresent } from 'lib/types'
import { State } from 'lib/state'
import { injectStore } from 'lib/store-rx-inject'
import { Store } from 'lib/store'
import { ObservableOf, SignalsOf } from 'lib/store-rx-store'

import { GenericAjaxError } from 'models/errors'
import { Path } from 'models/path'

import { AccessToken } from './token'
import { NavigateEventPayload } from './navigation'

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

export const initialState: UserStates = { type: UserStatus.Unknown }

export type UserEvents = {
  logIn: LoginUser
  logOut: unknown
  set: User
}

export type UserSources = { token: AccessToken }

export type UserSignals = SignalsOf<{
  navigate: NavigateEventPayload
  setToken: AccessToken
}>

export function createUser(
  store: Store<UserStates>,
  { logIn$, logOut$, set$, token$ }: ObservableOf<UserEvents & UserSources>,
  { navigate, setToken }: UserSignals,
  api: UserAndAuthenticationApi
) {
  return createRxState(
    store,
    merge<UserStates>(
      logIn$.pipe(map((data) => ({ type: UserStatus.LogIn, data }))),
      logIn$.pipe(
        exhaustMap((user) => api.login({ body: { user } })),
        userResponseToState
      ),
      logOut$.pipe(
        tap(() => navigate(Path.Feed)),
        mapTo({ type: UserStatus.Unauthorized })
      ),
      set$.pipe(map((user) => ({ type: UserStatus.Authorized, user }))),
      token$.pipe(
        filter(isPresent),
        injectStore(store),
        filter(
          ([token, state]) =>
            !(
              state.type === UserStatus.Authorized && state.user.token === token
            )
        ),
        exhaustMap(() => api.getCurrentUser()),
        userResponseToState
      ),
      token$.pipe(filter(isNull), mapTo({ type: UserStatus.Unauthorized }))
    ),
    tap((state) => {
      if (state.type === UserStatus.Authorized) {
        setToken(state.user.token)
      } else if (state.type === UserStatus.Unauthorized) {
        setToken(null)
      }
    })
  )
}

export type IsNotUnauthorizeEvents = ObservableOf<{
  user: UserStates
}>

export function createIsNotUnauthorized({ user$ }: IsNotUnauthorizeEvents) {
  return user$.pipe(map((state) => state.type !== UserStatus.Unauthorized))
}
