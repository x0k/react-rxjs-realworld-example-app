import React from 'react'

import { useRxState } from 'lib/store-rx-state'
import { useSignalsHooks } from 'lib/store-rx-signals'

import { Pagination } from 'components/pagination'
import { ArticlesList } from 'components/articles-list'

import {
  feed$,
  FeedTypeStates,
  feedSetFeedType,
  feedCleanup,
  feedSetPage,
  feedPerPage,
} from 'store/feed'
import { Article } from 'lib/conduit-client'
import { ErrorsList } from 'components/errors-list'

export interface FeedContainerProps {
  feedType: FeedTypeStates
  children: (article: Article) => JSX.Element
}

const topMarginStyle = { marginTop: 1 }

const onSetPage = (page: number) => feedSetPage.next(page)

export function FeedContainer({ feedType, children }: FeedContainerProps) {
  const hooks = useSignalsHooks(feedSetFeedType, feedCleanup, feedType)
  const { errors, articles, articlesCount, loading, page } = useRxState(
    feed$,
    hooks
  )
  if (Object.keys(errors).length > 0) {
    return <ErrorsList errors={errors} />
  }
  return (
    <>
      {articlesCount > 0 && (
        <ArticlesList>
          {articles.map((article) => (
            <li key={article.slug}>{children(article)}</li>
          ))}
        </ArticlesList>
      )}
      {articlesCount === 0 && (
        <p style={topMarginStyle}>No articles are here... yet.</p>
      )}
      {loading && <p style={topMarginStyle}>Loading articles...</p>}
      <Pagination
        count={articlesCount}
        current={page}
        perPage={feedPerPage}
        onClick={onSetPage}
      />
    </>
  )
}
