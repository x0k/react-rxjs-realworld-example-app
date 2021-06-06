import React from 'react'
import { Link } from 'react-router-dom'

import { Path } from 'lib/models'

import { Row } from 'components/row'
import { Page } from 'components/page'

import { LoginContainer } from 'containers/login'

export default function LoginPage() {
  return (
    <Page>
      <Row>
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Sign In</h1>

          <p className="text-xs-center">
            <Link to={Path.Registration}>Need an account?</Link>
          </p>

          <LoginContainer />
        </div>
      </Row>
    </Page>
  )
}
