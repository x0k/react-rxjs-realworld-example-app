import React, { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { ProfileFeedByType } from 'models/feed'

import { Container } from 'components/container'
import { Row } from 'components/row'

import { UserInfoContainer } from 'containers/user-info'
import { FeedContainer } from 'containers/feed'
import { ProfileTabsContainer } from 'containers/profile-tabs'

import { renderArticlePreview } from './common/render-article-preview'

export default function ProfilePage() {
  const { username } = useParams()
  const [params] = useSearchParams()
  const type = useMemo(() => params.get('type') ?? undefined, [params])
  return (
    <div className="profile-page">
      <UserInfoContainer username={username} />
      <Container>
        <Row>
          <div className="col-xs-12 col-md-10 offset-md-1">
            <ProfileTabsContainer
              type={type as ProfileFeedByType}
              username={username}
            />
            <FeedContainer>{renderArticlePreview}</FeedContainer>
          </div>
        </Row>
      </Container>
    </div>
  )
}
