import React from 'react'

import { foldState } from 'lib/state'
import { createSignalsHooks } from 'lib/rx-store'
import { useRxState } from 'lib/rx-store-react'

import { LoadableDataStatus } from 'models/loadable-data'
import { getFeedByTagPath } from 'models/path'

import { TagsList } from 'components/tags-list'
import { Tag } from 'components/tag'

import { tags } from 'store'
import { TagsStates } from 'store/tags'

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

const hooks = createSignalsHooks({ start: tags.load, stop: tags.stop })

export function TagsContainer() {
  const tagsState = useRxState(tags.state$, hooks)
  return foldTagsState(tagsState)
}
