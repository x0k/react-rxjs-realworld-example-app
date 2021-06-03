import React from 'react'

import { useRxState } from 'lib/store-rx-state'
import { foldState } from 'lib/state'
import { createSignalsHooks } from 'lib/store-rx-signals'

import { LoadableDataStatus } from 'models/loadable-data'
import { getFeedByTagPath } from 'models/path'

import { TagsList } from 'components/tags-list'
import { Tag } from 'components/tag'

import { tags$, tagsCleanup, tagsLoad, TagsStates } from 'store/tags'

const foldTagsState = foldState<
  LoadableDataStatus,
  TagsStates,
  JSX.Element | null
>({
  [LoadableDataStatus.Init]: () => null,
  [LoadableDataStatus.Loading]: () => <p>Loading tags...</p>,
  [LoadableDataStatus.IDLE]: ({ data }) => (
    <TagsList>
      {data.map((tag) => (
        <Tag to={getFeedByTagPath(tag)} key={tag}>
          {tag}
        </Tag>
      ))}
    </TagsList>
  ),
  [LoadableDataStatus.Error]: ({ error }) => <p>{error.message}</p>,
})

const hooks = createSignalsHooks({ start: tagsLoad, stop: tagsCleanup })

export function TagsContainer() {
  const tagsState = useRxState(tags$, hooks)
  return foldTagsState(tagsState)
}
