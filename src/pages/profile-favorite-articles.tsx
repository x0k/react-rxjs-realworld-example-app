import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { FeedType } from 'store/feed'

import { FeedContainer } from 'containers/feed'

import { renderArticlePreview } from './common/render-article-preview'

export default function ProfileFavoriteArticlesPage() {
  const { username } = useParams()
  const feedType = useMemo(
    () => ({ type: FeedType.Global, favorited: username }),
    [username]
  )
  return (
    <FeedContainer feedType={feedType}>{renderArticlePreview}</FeedContainer>
  )
}
