import { Subject, merge, of } from 'rxjs'
import {
  catchError,
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

import { Errors, GenericAjaxError } from 'models/errors'
import { Path } from 'models/path'

import { userSet } from './user'
import { navigation$, navigationPush } from './navigation'

export type RegistrationState = NewUser & {
  loading: boolean
  errors: Errors
}

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
            loading: false,
            errors: error.response.errors,
          })
        )
      )
    )
  ),
  takeUntil(registrationCleanup)
)
