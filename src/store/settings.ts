import { merge } from 'rxjs'
import { exhaustMap, filter, map, tap, takeUntil } from 'rxjs/operators'

import { UpdateUser, User, UserAndAuthenticationApi } from 'lib/conduit-client'
import { ChangeFieldEventPayload } from 'lib/event'
import { createRxState } from 'lib/store-rx-state'
import { isSpecificState } from 'lib/state'
import { omitFalsyProps } from 'lib/types'
import { ObservableOf, SignalsOf } from 'lib/store-rx-store'
import { Store } from 'lib/store'

import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'models/re-loadable-data'

import { UserStatus, UserStates } from './user'

export type SettingsState = UpdateUser & ReLoadableData

export const initialSettingsState: SettingsState = {
  errors: {},
  loading: false,
  bio: '',
  email: '',
  image: '',
  username: '',
  password: '',
}

export type SettingsEvents = {
  changeField: ChangeFieldEventPayload<UpdateUser>
  update: unknown
  stop: unknown
}

export type SettingsSources = { user: UserStates }

export type SettingsSignals = SignalsOf<{
  setUser: User
}>

export function createSettings(
  store: Store<SettingsState>,
  {
    changeField$,
    update$,
    user$,
    stop$,
  }: ObservableOf<SettingsEvents & SettingsSources>,
  { setUser }: SettingsSignals,
  api: UserAndAuthenticationApi
) {
  const catchGenericAjaxError =
    createGenericAjaxErrorCatcherForReLoadableData(store)
  return createRxState<SettingsState>(
    store,
    merge(
      changeField$.pipe(
        map(({ field, value }) => ({ ...store.state, [field]: value }))
      ),
      update$.pipe(map(() => ({ ...store.state, loading: true }))),
      update$.pipe(
        exhaustMap(() =>
          api.updateCurrentUser({
            body: { user: omitFalsyProps(store.state as Record<string, any>) },
          })
        ),
        tap(({ user }) => setUser(user)),
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
    takeUntil(stop$)
  )
}
