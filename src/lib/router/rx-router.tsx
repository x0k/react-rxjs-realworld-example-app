import React, { ReactNode } from 'react'
import { BrowserHistory, Update } from 'history'
import { Router as ReactRouter } from 'react-router-dom'
import { Observable } from 'rxjs'

import { useRxState } from 'lib/rx-store-react'

export interface RouterProps {
  history: BrowserHistory
  children?: ReactNode
  state$: Observable<Update>
}

export function RxRouter({ children, history, state$ }: RouterProps) {
  const { action, location } = useRxState(state$)
  return (
    <ReactRouter
      children={children}
      action={action}
      location={location}
      navigator={history}
    />
  )
}
