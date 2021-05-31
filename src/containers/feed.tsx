import React from 'react'

import { useRxState } from 'lib/store-rx-state'
import { createStopSignalHooks } from 'lib/store-rx-signals'
import { Article } from 'lib/conduit-client'

import { ErrorsList } from 'components/errors-list'
import { Pagination } from 'components/pagination'
import { ArticlesList } from 'components/articles-list'

import { feed$, feedCleanup, feedPerPage } from 'store/feed'
import { feedPage$, feedPageSet } from 'store/feed-page'

export interface FeedContainerProps {
  children: (article: Article) => JSX.Element
}

const topMarginStyle = { marginTop: 1 }

const onSetPage = (page: number) => feedPageSet.next(page)

const hooks = createStopSignalHooks(feedCleanup)

export function FeedContainer({ children }: FeedContainerProps) {
  const page = useRxState(feedPage$)
  const { errors, articles, articlesCount, loading } = useRxState(feed$, hooks)
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
