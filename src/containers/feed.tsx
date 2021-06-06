import React from 'react'

import { Article } from 'lib/conduit-client'
import { createStopSignalHooks } from 'lib/rx-store'
import { useRxState } from 'lib/rx-store-react'
import { feedPerPage } from 'lib/app-store'

import { ErrorsList } from 'components/errors-list'
import { Pagination } from 'components/pagination'
import { ArticlesList } from 'components/articles-list'

import { feed, feedPage } from 'app-store'

export interface FeedContainerProps {
  children: (article: Article) => JSX.Element
}

const topMarginStyle = { marginTop: 1 }

const hooks = createStopSignalHooks(feed.stop)

export function FeedContainer({ children }: FeedContainerProps) {
  const page = useRxState(feedPage.state$)
  const { errors, articles, articlesCount, loading } = useRxState(
    feed.state$,
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
        onClick={feedPage.set}
      />
    </>
  )
}
