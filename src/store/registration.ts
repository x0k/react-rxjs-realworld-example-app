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

import { NewUser, User, UserAndAuthenticationApi } from 'lib/conduit-client'
import { ChangeFieldEventPayload } from 'lib/event'
import { isLocationWithFromState } from 'lib/router'
import { SignalsOf, createRxStateFactory } from 'lib/rx-store'

import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'models/re-loadable-data'
import { Path } from 'models/path'

import { NavigateEventPayload } from './navigation'

export type RegistrationState = NewUser & ReLoadableData

export const initialRegistrationState: RegistrationState = {
  email: '',
  password: '',
  username: '',
  errors: {},
  loading: false,
}

export type RegistrationEvents = {
  changeField: ChangeFieldEventPayload<NewUser>
  signUp: unknown
  stop: unknown
}

export type RegistrationSources = {
  navigate: Update
}

export type RegistrationSignals = SignalsOf<{
  setUser: User
  navigate: NavigateEventPayload
}>

export const createRegistration = createRxStateFactory<
  RegistrationState,
  RegistrationEvents & RegistrationSources,
  [RegistrationSignals, UserAndAuthenticationApi]
>(
  (
    store,
    { changeField$, signUp$, stop$, navigate$ },
    { navigate, setUser },
    api
  ) => {
    const catchGenericAjaxError =
      createGenericAjaxErrorCatcherForReLoadableData(store)
    return [
      merge(
        changeField$.pipe(
          map(({ field, value }) => ({ ...store.state, [field]: value }))
        ),
        signUp$.pipe(map(() => ({ ...store.state, loading: true }))),
        signUp$.pipe(
          exhaustMap(() => api.createUser({ body: { user: store.state } })),
          withLatestFrom(navigate$),
          tap(([{ user }, { location }]) => {
            setUser(user)
            navigate(
              isLocationWithFromState(location)
                ? location.state.from
                : Path.Feed
            )
          }),
          mapTo(initialRegistrationState),
          catchGenericAjaxError
        )
      ),
      takeUntil(stop$),
    ]
  }
)
