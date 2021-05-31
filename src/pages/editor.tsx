import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { Page } from 'components/page'
import { Row } from 'components/row'
import { Spinner } from 'components/spinner'

export default function EditorPage() {
  return (
    <Page>
      <Row>
        <div className="col-md-10 offset-md-1 col-xs-12">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </Row>
    </Page>
  )
}
