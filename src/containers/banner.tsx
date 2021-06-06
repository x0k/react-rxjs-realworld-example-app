import React from 'react'

import { useRxState } from 'lib/rx-store-react'
import { APP_NAME } from 'lib/models'

import { Banner } from 'components/banner'
import { Container } from 'components/container'

import { isNotUnauthorized$ } from 'app-store'

export function BannerContainer() {
  const isNotUnauthorized = useRxState(isNotUnauthorized$)
  return isNotUnauthorized ? null : (
    <Banner>
      <Container>
        <h1 className="logo-font">{APP_NAME}</h1>
        <p>A place to share your knowledge.</p>
      </Container>
    </Banner>
  )
}
