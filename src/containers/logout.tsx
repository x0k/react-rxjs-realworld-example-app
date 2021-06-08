import React from 'react'

import { Button, ButtonVariant } from 'components/button'

import { userSubjects } from 'app-store'

export function LogoutContainer() {
  return (
    <Button
      variant={ButtonVariant.OutlineDanger}
      onClick={() => userSubjects.logOut$.next()}
    >
      Or click here to logout.
    </Button>
  )
}
