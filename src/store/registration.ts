import { Subject, merge } from 'rxjs'
import {
  exhaustMap,
  map,
  mapTo,
  tap,
  withLatestFrom,
  takeUntil,
} from 'rxjs/operators'

import { NewUser } from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { userAndAuthenticationApi } from 'lib/api'
import { ChangeFieldEventPayload } from 'lib/event'
import { isLocationWithFromState } from 'lib/router'
import { createMemoryStore } from 'lib/store'

import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'models/re-loadable-data'
import { Path } from 'models/path'

import { userSet } from './user'
import { navigation$, navigationNavigate } from './navigation'

export type RegistrationState = NewUser & ReLoadableData

export const registrationChangeField = new Subject<
  ChangeFieldEventPayload<NewUser>
>()

export const registrationSignUp = new Subject()

export const registrationCleanup = new Subject()

const initialState: RegistrationState = {
  email: '',
  password: '',
  username: '',
  errors: {},
  loading: false,
}

const store = createMemoryStore(initialState)

const catchGenericAjaxError =
  createGenericAjaxErrorCatcherForReLoadableData(store)

export const registration$ = createRxState(
  store,
  merge(
    registrationChangeField.pipe(
      map(({ field, value }) => ({ ...store.state, [field]: value }))
    ),
    registrationSignUp.pipe(map(() => ({ ...store.state, loading: true }))),
    registrationSignUp.pipe(
      exhaustMap(() =>
        userAndAuthenticationApi.createUser({ body: { user: store.state } })
      ),
      tap(({ user }) => userSet.next(user)),
      withLatestFrom(navigation$),
      tap(([, { location }]) =>
        navigationNavigate.next(
          isLocationWithFromState(location) ? location.state.from : Path.Feed
        )
      ),
      mapTo(initialState),
      catchGenericAjaxError
    )
  ),
  takeUntil(registrationCleanup)
)
