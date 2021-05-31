import React from 'react'
import { Link } from 'react-router-dom'

import { useRxState } from 'lib/store-rx-state'
import { foldState } from 'lib/state'
import { createSignalsHooks } from 'lib/store-rx-signals'

import { getTagPath } from 'models/path'
import { LoadableDataStatus } from 'models/loadable-data'

import { TagsList } from 'components/tags-list'

import { tags$, tagsCleanup, tagsLoad, TagsStates } from 'store/tags'

const foldTagsState = foldState<LoadableDataStatus, TagsStates, JSX.Element | null>({
  [LoadableDataStatus.Init]: () => null,
  [LoadableDataStatus.Loading]: () => <p>Loading tags...</p>,
  [LoadableDataStatus.IDLE]: ({ data }) => (
    <TagsList>
      {data.map((tag) => (
        <Link key={tag} className="tag-default tag-pill" to={getTagPath(tag)}>
          {tag}
        </Link>
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
