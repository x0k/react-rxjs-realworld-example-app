import { merge, of, Subject } from 'rxjs'
import {
  catchError,
  exhaustMap,
  filter,
  map,
  mapTo,
  takeUntil,
} from 'rxjs/operators'

import { createRxState } from 'lib/store-rx-state'
import { TagsResponse } from 'lib/conduit-client'
import { defaultApi } from 'lib/api'
import { isSpecificState } from 'lib/state'
import { createMemoryStore } from 'lib/store'

import { DataStates, DataStatus } from 'models/data'
import { GenericAjaxError } from 'models/errors'

export type Tag = string

export type TagList = Tag[]

export type TagsStates = DataStates<TagList, GenericAjaxError>

export const tagsLoad = new Subject()

export const tagsCleanup = new Subject()

const store = createMemoryStore<TagsStates>({ type: DataStatus.Init })

export const tags$ = createRxState<TagsStates>(
  store,
  merge(
    tagsLoad.pipe(
      map(() => store.state),
      filter(isSpecificState(DataStatus.Init)),
      mapTo({ type: DataStatus.Loading })
    ),
    tagsLoad.pipe(
      exhaustMap(() => defaultApi.tagsGet()),
      map<TagsResponse, TagsStates>(({ tags }) => ({
        type: DataStatus.IDLE,
        data: tags,
      })),
      catchError((error: GenericAjaxError, caught) =>
        merge(caught, of<TagsStates>({ type: DataStatus.Error, error }))
      )
    )
  ),
  takeUntil(tagsCleanup)
)
