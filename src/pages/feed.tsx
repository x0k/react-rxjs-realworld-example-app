import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { FeedByType } from 'lib/models'

import { Page } from 'components/page'
import { Row } from 'components/row'

import { BannerContainer } from 'containers/banner'
import { TagsContainer } from 'containers/tags'
import { FeedTabsContainer } from 'containers/feed-tabs'
import { FeedContainer } from 'containers/feed'

import { renderArticlePreview } from './common/render-article-preview'

export default function FeedPage() {
  const [params] = useSearchParams()
  const tag = useMemo(() => params.get('tag') ?? undefined, [params])
  const type = useMemo(() => params.get('type') ?? undefined, [params])
  return (
    <div className="home-page">
      <BannerContainer />
      <Page>
        <Row>
          <main className="col-md-9">
            <FeedTabsContainer tag={tag} type={type as FeedByType} />
            <FeedContainer>{renderArticlePreview}</FeedContainer>
          </main>
          <div className="col-md-3">
            <aside className="sidebar">
              <p>Popular Tags</p>
              <TagsContainer />
            </aside>
          </div>
        </Row>
      </Page>
    </div>
  )
}
