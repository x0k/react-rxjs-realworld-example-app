import { merge } from 'rxjs'
import { filter, map, mapTo, switchMap, takeUntil } from 'rxjs/operators'

import { DefaultApi, TagsResponse } from 'lib/conduit-client'
import { isSpecificState } from 'lib/state'
import { createRxStateFactory } from 'lib/rx-store'

import { GenericAjaxError } from 'models/errors'
import {
  catchGenericAjaxErrorForLoadableData,
  LoadableDataStates,
  LoadableDataStatus,
} from 'models/loadable-data'

export type Tag = string

export type TagList = Tag[]

export type TagsStates = LoadableDataStates<TagList, GenericAjaxError>

export type TagsEvents = {
  load: unknown
  stop: unknown
}

export const createTags = createRxStateFactory<TagsStates, TagsEvents, [DefaultApi]>(
  (store, { load$, stop$ }, api) => [
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
