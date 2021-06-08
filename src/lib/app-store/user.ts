import { merge, Observable, of } from 'rxjs'
import { catchError, exhaustMap, filter, map, mapTo, tap } from 'rxjs/operators'

import {
  LoginUser,
  User,
  UserAndAuthenticationApi,
  UserResponse,
} from 'lib/conduit-client'
import { isNull, isPresent } from 'lib/types'
import { State } from 'lib/state'
import { StateOptions, injectStore, createRxStateFactory } from 'lib/rx-store'
import { GenericAjaxError, Path } from 'lib/models'

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

export const initialUserState: UserStates = { type: UserStatus.Unknown }

export type UserEvents = {
  logIn: LoginUser
  logOut: unknown
  set: User
}

export type UserSources = { token: AccessToken }

export type UserSignals = {
  navigate: NavigateEventPayload
  setToken: AccessToken
}

export const createUser = createRxStateFactory(
  (
    {
      events: { logIn$, logOut$, set$, token$ },
      signals: { navigate$, setToken$ },
      store,
    }: StateOptions<UserStates, UserEvents & UserSources, UserSignals>,
    api: UserAndAuthenticationApi
  ) => [
    merge<UserStates>(
      logIn$.pipe(map((data) => ({ type: UserStatus.LogIn, data }))),
      logIn$.pipe(
        exhaustMap((user) => api.login({ body: { user } })),
        userResponseToState
      ),
      logOut$.pipe(
        tap(() => navigate$.next(Path.Feed)),
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
    tap<UserStates>((state) => {
      if (state.type === UserStatus.Authorized) {
        setToken$.next(state.user.token)
      } else if (state.type === UserStatus.Unauthorized) {
        setToken$.next(null)
      }
    }),
  ]
)

export const createIsNotUnauthorized = (user$: Observable<UserStates>) =>
  user$.pipe(map((state) => state.type !== UserStatus.Unauthorized))
