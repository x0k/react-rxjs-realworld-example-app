import React from 'react'
import { useParams } from 'react-router-dom'

import { Container } from 'components/container'
import { Row } from 'components/row'

import { UserInfoContainer } from 'containers/user-info'
import { FeedContainer } from 'containers/feed'
import { ProfileTabsContainer } from 'containers/profile-tabs'

import { renderArticlePreview } from './common/render-article-preview'

export interface ProfilePageProps {
  favorites?: boolean
}

export default function ProfilePage({ favorites }: ProfilePageProps) {
  const { username } = useParams()
  return (
    <div className="profile-page">
      <UserInfoContainer username={username} />
      <Container>
        <Row>
          <div className="col-xs-12 col-md-10 offset-md-1">
            <ProfileTabsContainer favorites={favorites} username={username} />
            <FeedContainer>{renderArticlePreview}</FeedContainer>
          </div>
        </Row>
      </Container>
    </div>
  )
}
