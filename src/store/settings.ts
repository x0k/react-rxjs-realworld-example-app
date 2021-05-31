import { merge, Subject } from 'rxjs'
import { exhaustMap, filter, map, tap, takeUntil } from 'rxjs/operators'

import { UpdateUser } from 'lib/conduit-client'
import { ChangeFieldEventPayload } from 'lib/event'
import { createRxState } from 'lib/store-rx-state'
import { userAndAuthenticationApi } from 'lib/api'
import { isSpecificState } from 'lib/state'
import { omitFalsyProps } from 'lib/types'
import { createMemoryStore } from 'lib/store'

import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'models/re-loadable-data'

import { userSet, user$, UserStatus } from './user'

export type SettingsState = UpdateUser & ReLoadableData

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

const catchGenericAjaxError =
  createGenericAjaxErrorCatcherForReLoadableData(store)

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
      catchGenericAjaxError
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
