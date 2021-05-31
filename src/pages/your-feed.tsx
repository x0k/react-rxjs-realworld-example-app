import React from 'react'

import { FeedTabsContainer } from 'containers/feed-tabs'
import { FeedContainer } from 'containers/feed'

import { FeedType, FeedTypeStates } from 'store/feed'
import { renderArticlePreview } from './common/render-article-preview'

const feedType: FeedTypeStates = { type: FeedType.Your }

export default function YourFeedPage() {
  return (
    <>
      <FeedTabsContainer />
      <FeedContainer feedType={feedType}>{renderArticlePreview}</FeedContainer>
    </>
  )
}
