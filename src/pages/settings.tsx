import React from 'react'

import { Page } from 'components/page'
import { Row } from 'components/row'

import { LogoutContainer } from 'containers/logout'
import { SettingsContainer } from 'containers/settings'

export default function SettingsPage() {
  return (
    <Page>
      <Row>
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Your Settings</h1>
          <SettingsContainer />
          <hr />
          <LogoutContainer />
        </div>
      </Row>
    </Page>
  )
}
