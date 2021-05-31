import React from 'react'

import { Button, ButtonVariant } from 'components/button'

import { userLogOut } from 'store/user'

const onLogOut = () => userLogOut.next()

export function LogoutContainer() {
  return (
    <Button variant={ButtonVariant.OutlineDanger} onClick={onLogOut}>
      Or click here to logout.
    </Button>
  )
}
