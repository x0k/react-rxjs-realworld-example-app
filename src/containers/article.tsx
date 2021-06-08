import React, { useMemo } from 'react'

import { Article } from 'lib/conduit-client'
import { foldState } from 'lib/state'
import { useSignalsHooks, useRxState } from 'lib/rx-store-react'
import { LoadableDataStatus, ArticleSlug } from 'lib/models'
import { ArticleStates } from 'lib/app-store'

import { article$, articleSubjects } from 'app-store'

export interface ArticleContainerProps {
  slug: ArticleSlug
  children: (article: Article) => JSX.Element
}

export function ArticleContainer({ children, slug }: ArticleContainerProps) {
  const hooks = useSignalsHooks(
    articleSubjects.load$,
    articleSubjects.stop$,
    slug
  )
  const articleState = useRxState(article$, hooks)
  return useMemo(
    () =>
      foldState<LoadableDataStatus, ArticleStates, JSX.Element | null>({
        [LoadableDataStatus.Init]: () => null,
        [LoadableDataStatus.Loading]: () => <p>Loading article...</p>,
        [LoadableDataStatus.IDLE]: ({ data }) => children(data),
        [LoadableDataStatus.Error]: ({ error }) => <p>{error.message}</p>,
      })(articleState),
    [articleState, children]
  )
}
