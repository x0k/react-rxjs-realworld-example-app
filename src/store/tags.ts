import { merge } from 'rxjs'
import { filter, map, mapTo, switchMap, takeUntil } from 'rxjs/operators'

import { createRxState } from 'lib/store-rx-state'
import { TagsResponse } from 'lib/conduit-client'
import { defaultApi } from 'lib/api'
import { isSpecificState } from 'lib/state'
import { Store } from 'lib/store'

import { GenericAjaxError } from 'models/errors'
import {
  catchGenericAjaxErrorForLoadableData,
  LoadableDataStates,
  LoadableDataStatus,
} from 'models/loadable-data'
import { ObservableOf } from 'lib/store-rx-store'

export type Tag = string

export type TagList = Tag[]

export type TagsStates = LoadableDataStates<TagList, GenericAjaxError>

export type TagsEvents = ObservableOf<{
  load: unknown
  stop: unknown
}>

export function createTags(
  store: Store<TagsStates>,
  { load$, stop$ }: TagsEvents,
) {
  return createRxState<TagsStates>(
    store,
    merge(
      load$.pipe(
        map(() => store.state),
        filter(isSpecificState(LoadableDataStatus.Init)),
        mapTo({ type: LoadableDataStatus.Loading })
      ),
      load$.pipe(
        switchMap(() => defaultApi.tagsGet()),
        map<TagsResponse, TagsStates>(({ tags }) => ({
          type: LoadableDataStatus.IDLE,
          data: tags,
        })),
        catchGenericAjaxErrorForLoadableData
      )
    ),
    takeUntil(stop$)
  )
}
