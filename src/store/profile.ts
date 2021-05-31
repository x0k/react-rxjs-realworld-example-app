import { Subject, combineLatest, merge, Observable, of, EMPTY } from 'rxjs'
import {
  exhaustMap,
  filter,
  map,
  mapTo,
  switchMap,
  withLatestFrom,
  takeUntil,
} from 'rxjs/operators'

import { profileApi } from 'lib/api'
import { Profile, ProfileResponse } from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { isSpecificState } from 'lib/state'
import { injectStore } from 'lib/store-rx-inject'
import { createMemoryStore } from 'lib/store'

import {
  catchGenericAjaxErrorForLoadableData,
  LoadableDataStates,
  LoadableDataStatus,
} from 'models/loadable-data'
import { GenericAjaxError } from 'models/errors'

import { user$, UserStatus } from './user'

export type ProfileStates = LoadableDataStates<Profile, GenericAjaxError>

export type ProfileUsername = Profile['username']

export const profileLoad = new Subject<ProfileUsername>()

export const profileCleanup = new Subject()

export const profileToggleFollowing = new Subject<ProfileUsername>()

const profileResponseToState = (
  observable: Observable<ProfileResponse>
): Observable<ProfileStates> =>
  observable.pipe(
    map<ProfileResponse, ProfileStates>(({ profile }) => ({
      type: LoadableDataStatus.IDLE,
      data: profile,
    })),
    catchGenericAjaxErrorForLoadableData
  )

const store = createMemoryStore<ProfileStates>({
  type: LoadableDataStatus.Init,
})

export const profile$ = createRxState<ProfileStates>(
  store,
  merge(
    profileLoad.pipe(mapTo({ type: LoadableDataStatus.Loading })),
    profileLoad.pipe(
      withLatestFrom(user$),
      switchMap(([username, user]) =>
        user.type === UserStatus.Authorized && user.user.username === username
          ? of<ProfileStates>({
              type: LoadableDataStatus.IDLE,
              data: { ...user.user, following: false },
            })
          : EMPTY
      )
    ),
    profileLoad.pipe(
      exhaustMap((username) => profileApi.getProfileByUsername({ username })),
      profileResponseToState
    ),
    profileToggleFollowing.pipe(
      injectStore(store, filter(isSpecificState(LoadableDataStatus.IDLE))),
      exhaustMap(([username, state]) =>
        state.data.following
          ? profileApi.unfollowUserByUsername({ username })
          : profileApi.followUserByUsername({ username })
      ),
      profileResponseToState
    )
  ),
  takeUntil(profileCleanup)
)

export const isCurrentUser$ = combineLatest([user$, profile$]).pipe(
  map(
    ([user, profile]) =>
      user.type === UserStatus.Authorized &&
      profile.type === LoadableDataStatus.IDLE &&
      user.user.username === profile.data.username
  )
)
