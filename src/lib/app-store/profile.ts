import { combineLatest, merge, Observable, of, EMPTY } from 'rxjs'
import {
  exhaustMap,
  filter,
  map,
  mapTo,
  switchMap,
  withLatestFrom,
  takeUntil,
} from 'rxjs/operators'

import { Profile, ProfileApi, ProfileResponse } from 'lib/conduit-client'
import { isSpecificState } from 'lib/state'
import {
  injectStore,
  createRxStateFactory,
  StateHandlers,
  StateOptions,
} from 'lib/rx-store'

import {
  catchGenericAjaxErrorForLoadableData,
  LoadableDataStates,
  LoadableDataStatus,
} from 'lib/models'
import { GenericAjaxError } from 'lib/models'
import { ProfileUsername } from 'lib/models'

import { UserStates, UserStatus } from './user'

export type ProfileStates = LoadableDataStates<Profile, GenericAjaxError>

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

export type ProfileEvents = {
  load: ProfileUsername
  toggleFollowing: ProfileUsername
  stop: unknown
}

export type ProfileSources = { user: UserStates }

export const createProfile = createRxStateFactory(
  (
    {
      events: { load$, stop$, toggleFollowing$ },
      sources: { user$ },
      store,
    }: StateOptions<ProfileStates, ProfileEvents, ProfileSources>,
    api: ProfileApi
  ): StateHandlers<ProfileStates> => [
    merge(
      load$.pipe(mapTo({ type: LoadableDataStatus.Loading })),
      load$.pipe(
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
      load$.pipe(
        switchMap((username) => api.getProfileByUsername({ username })),
        profileResponseToState
      ),
      toggleFollowing$.pipe(
        injectStore(store, filter(isSpecificState(LoadableDataStatus.IDLE))),
        exhaustMap(([username, state]) =>
          state.data.following
            ? api.unfollowUserByUsername({ username })
            : api.followUserByUsername({ username })
        ),
        profileResponseToState
      )
    ),
    takeUntil(stop$),
  ]
)

export const createIsCurrentUser = (
  profile$: Observable<ProfileStates>,
  user$: Observable<UserStates>
) =>
  combineLatest([user$, profile$]).pipe(
    map(
      ([user, profile]) =>
        user.type === UserStatus.Authorized &&
        profile.type === LoadableDataStatus.IDLE &&
        user.user.username === profile.data.username
    )
  )
