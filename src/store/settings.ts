import { merge, of, Subject } from 'rxjs'
import {
  catchError,
  exhaustMap,
  filter,
  map,
  tap,
  takeUntil,
} from 'rxjs/operators'

import { UpdateUser } from 'lib/conduit-client'
import { ChangeFieldEventPayload } from 'lib/event'
import { createRxState } from 'lib/store-rx-state'
import { userAndAuthenticationApi } from 'lib/api'
import { isSpecificState } from 'lib/state'
import { omitFalsyProps } from 'lib/types'
import { createMemoryStore } from 'lib/store'

import { Errors, GenericAjaxError } from 'models/errors'

import { userSet, user$, UserStatus } from './user'

export type SettingsState = UpdateUser & {
  loading: boolean
  errors: Errors
}

export const settingsChangeField = new Subject<
  ChangeFieldEventPayload<UpdateUser>
>()

export const settingsUpdate = new Subject()

export const settingsCleanup = new Subject()

const store = createMemoryStore<SettingsState>({
  errors: {},
  loading: false,
  bio: '',
  email: '',
  image: '',
  username: '',
  password: '',
})

export const settings$ = createRxState<SettingsState>(
  store,
  merge(
    settingsChangeField.pipe(
      map(({ field, value }) => ({ ...store.state, [field]: value }))
    ),
    settingsUpdate.pipe(map(() => ({ ...store.state, loading: true }))),
    settingsUpdate.pipe(
      exhaustMap(() =>
        userAndAuthenticationApi.updateCurrentUser({
          body: { user: omitFalsyProps(store.state as Record<string, any>) },
        })
      ),
      tap(({ user }) => userSet.next(user)),
      map(() => ({ ...store.state, loading: false, errors: {} })),
      catchError((error: GenericAjaxError, caught) =>
        merge(
          caught,
          of<SettingsState>({
            ...store.state,
            loading: false,
            errors: error.response.errors,
          })
        )
      )
    ),
    user$.pipe(
      filter(isSpecificState(UserStatus.Authorized)),
      map((user) => ({
        ...store.state,
        ...omitFalsyProps(user.user as Record<string, any>),
      }))
    )
  ),
  takeUntil(settingsCleanup)
)
