import React from 'react'
import { Outlet } from 'react-router-dom'

import { Page } from 'components/page'
import { Row } from 'components/row'

import { BannerContainer } from 'containers/banner'
import { TagsContainer } from 'containers/tags'

export default function HomePage() {
  return (
    <div className="home-page">
      <BannerContainer />
      <Page>
        <Row>
          <main className="col-md-9">
            <Outlet />
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
