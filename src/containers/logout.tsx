import React from 'react'

import { Button, ButtonVariant } from 'components/button'

import { user } from 'app-store'

export function LogoutContainer() {
  return (
    <Button variant={ButtonVariant.OutlineDanger} onClick={user.logOut}>
      Or click here to logout.
    </Button>
  )
}
