import React, { Suspense } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { Path } from 'models/path'

import { Container } from 'components/container'
import { Row } from 'components/row'
import { NavItem } from 'components/nav-item'
import { NavLink } from 'components/nav-link'

import { UserInfoContainer } from 'containers/user-info'
import { Spinner } from 'components/spinner'

export default function ProfilePage() {
  const { username } = useParams()
  return (
    <div className="profile-page">
      <UserInfoContainer username={username} />
      <Container>
        <Row>
          <div className="col-xs-12 col-md-10 offset-md-1">
            <ul className="nav nav-pills outline-active articles-toggle">
              <NavItem>
                <NavLink to={Path.ProfileArticles}>My Articles</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={Path.ProfileFavorites}>Favorited Articles</NavLink>
              </NavItem>
            </ul>
            <Suspense fallback={<Spinner />}>
              <Outlet />
            </Suspense>
          </div>
        </Row>
      </Container>
    </div>
  )
}
