import React from 'react'
import { Link } from 'react-router-dom'

import { useRxState } from 'lib/store-rx-state'
import { foldState } from 'lib/state'
import { createSignalsHooks } from 'lib/store-rx-signals'

import { getTagPath } from 'models/path'
import { DataStatus } from 'models/data'

import { TagsList } from 'components/tags-list'

import { tags$, tagsCleanup, tagsLoad, TagsStates } from 'store/tags'

const foldTagsState = foldState<DataStatus, TagsStates, JSX.Element | null>({
  [DataStatus.Init]: () => null,
  [DataStatus.Loading]: () => <p>Loading tags...</p>,
  [DataStatus.IDLE]: ({ data }) => (
    <TagsList>
      {data.map((tag) => (
        <Link key={tag} className="tag-default tag-pill" to={getTagPath(tag)}>
          {tag}
        </Link>
      ))}
    </TagsList>
  ),
  [DataStatus.Error]: ({ error }) => <p>{error.message}</p>,
})

const hooks = createSignalsHooks({ start: tagsLoad, stop: tagsCleanup })

export function TagsContainer() {
  const tagsState = useRxState(tags$, hooks)
  return foldTagsState(tagsState)
}
