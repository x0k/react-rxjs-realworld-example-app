import React, { useMemo } from 'react'

import { Article } from 'lib/conduit-client'
import { useRxState } from 'lib/store-rx-state'
import { foldState } from 'lib/state'
import { useSignalsHooks } from 'lib/store-rx-signals'

import { DataStatus } from 'models/data'
import { ArticleSlug } from 'models/article'

import {
  article$,
  articleCleanup,
  articleLoad,
  ArticleStates,
} from 'store/article'

export interface ArticleContainerProps {
  slug: ArticleSlug
  children: (article: Article) => JSX.Element
}

export function ArticleContainer({ children, slug }: ArticleContainerProps) {
  const hooks = useSignalsHooks(articleLoad, articleCleanup, slug)
  const articleState = useRxState(article$, hooks)
  return useMemo(
    () =>
      foldState<DataStatus, ArticleStates, JSX.Element | null>({
        [DataStatus.Init]: () => null,
        [DataStatus.Loading]: () => <p>Loading article...</p>,
        [DataStatus.IDLE]: ({ data }) => children(data),
        [DataStatus.Error]: ({ error }) => <p>{error.message}</p>,
      })(articleState),
    [articleState, children]
  )
}
