import React from 'react'
import { Link } from 'react-router-dom'

import { Path } from 'lib/models'

import { Page } from 'components/page'
import { Row } from 'components/row'

import { RegistrationContainer } from 'containers/registration'

export default function RegistrationPage() {
  return (
    <Page>
      <Row>
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Sign Up</h1>

          <p className="text-xs-center">
            <Link to={Path.Login}>Have an account?</Link>
          </p>
          <RegistrationContainer />
        </div>
      </Row>
    </Page>
  )
}
