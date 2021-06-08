import React from 'react'

import { foldState } from 'lib/state'
import { createSignalsHooks } from 'lib/rx-store'
import { useRxState } from 'lib/rx-store-react'
import { LoadableDataStatus, getFeedByTagPath } from 'lib/models'
import { TagsStates } from 'lib/app-store'

import { TagsList } from 'components/tags-list'
import { Tag } from 'components/tag'

import { tags$, tagsSubjects } from 'app-store'

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

const hooks = createSignalsHooks({
  start: tagsSubjects.load$,
  stop: tagsSubjects.stop$,
})

export function TagsContainer() {
  const tagsState = useRxState(tags$, hooks)
  return foldTagsState(tagsState)
}
