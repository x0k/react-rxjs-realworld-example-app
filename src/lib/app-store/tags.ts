import { merge } from 'rxjs'
import { filter, map, mapTo, switchMap, takeUntil } from 'rxjs/operators'

import { DefaultApi, TagsResponse } from 'lib/conduit-client'
import { isSpecificState } from 'lib/state'
import { createRxStateFactory, StateHandlers, StateOptions } from 'lib/rx-store'
import {
  GenericAjaxError,
  catchGenericAjaxErrorForLoadableData,
  LoadableDataStates,
  LoadableDataStatus,
} from 'lib/models'

export type Tag = string

export type TagList = Tag[]

export type TagsStates = LoadableDataStates<TagList, GenericAjaxError>

export type TagsEvents = {
  load: unknown
  stop: unknown
}

export const createTags = createRxStateFactory(
  (
    { store, events: { load$, stop$ } }: StateOptions<TagsStates, TagsEvents>,
    api: DefaultApi
  ): StateHandlers<TagsStates> => [
    merge(
      load$.pipe(
        map(() => store.state),
        filter(isSpecificState(LoadableDataStatus.Init)),
        mapTo({ type: LoadableDataStatus.Loading })
      ),
      load$.pipe(
        switchMap(() => api.tagsGet()),
        map<TagsResponse, TagsStates>(({ tags }) => ({
          type: LoadableDataStatus.IDLE,
          data: tags,
        })),
        catchGenericAjaxErrorForLoadableData
      )
    ),
    takeUntil(stop$),
  ]
)
