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
import { createRxStateFactory, StateOptions, StateHandlers } from 'lib/rx-store'
import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
  Path,
} from 'lib/models'

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
  navigation: Update
}

export type RegistrationSignals = {
  setUser: User
  navigate: NavigateEventPayload
}

export const createRegistration = createRxStateFactory(
  (
    {
      events: { changeField$, signUp$, stop$, navigation$ },
      signals: { navigate$, setUser$ },
      store,
    }: StateOptions<
      RegistrationState,
      RegistrationEvents & RegistrationSources,
      RegistrationSignals
    >,
    api: UserAndAuthenticationApi
  ): StateHandlers<RegistrationState> => {
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
          withLatestFrom(navigation$),
          tap(([{ user }, { location }]) => {
            setUser$.next(user)
            navigate$.next(
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
