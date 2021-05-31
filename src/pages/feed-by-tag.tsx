import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { FeedTabsContainer } from 'containers/feed-tabs'
import { FeedContainer } from 'containers/feed'

import { FeedType, FeedTypeStates } from 'store/feed'

import { renderArticlePreview } from './common/render-article-preview'

export default function YourFeedPage() {
  const [params] = useSearchParams()
  const tag = useMemo(() => params.get('tag'), [params])
  if (typeof tag !== 'string') {
    throw new Error(`Unexpected tag "${tag}"`)
  }
  const feedType = useMemo<FeedTypeStates>(
    () => ({ type: FeedType.Global, tag }),
    [tag]
  )
  return (
    <>
      <FeedTabsContainer tag={tag} />
      <FeedContainer feedType={feedType}>{renderArticlePreview}</FeedContainer>
    </>
  )
}
