import { merge, Subject } from 'rxjs'
import { filter, map, mapTo, switchMap, takeUntil } from 'rxjs/operators'

import { createRxState } from 'lib/store-rx-state'
import { TagsResponse } from 'lib/conduit-client'
import { defaultApi } from 'lib/api'
import { isSpecificState } from 'lib/state'
import { createMemoryStore } from 'lib/store'

import { GenericAjaxError } from 'models/errors'
import {
  catchGenericAjaxErrorForLoadableData,
  LoadableDataStates,
  LoadableDataStatus,
} from 'models/loadable-data'

export type Tag = string

export type TagList = Tag[]

export type TagsStates = LoadableDataStates<TagList, GenericAjaxError>

export const tagsLoad = new Subject()

export const tagsCleanup = new Subject()

const store = createMemoryStore<TagsStates>({ type: LoadableDataStatus.Init })

export const tags$ = createRxState<TagsStates>(
  store,
  merge(
    tagsLoad.pipe(
      map(() => store.state),
      filter(isSpecificState(LoadableDataStatus.Init)),
      mapTo({ type: LoadableDataStatus.Loading })
    ),
    tagsLoad.pipe(
      switchMap(() => defaultApi.tagsGet()),
      map<TagsResponse, TagsStates>(({ tags }) => ({
        type: LoadableDataStatus.IDLE,
        data: tags,
      })),
      catchGenericAjaxErrorForLoadableData
    )
  ),
  takeUntil(tagsCleanup)
)
