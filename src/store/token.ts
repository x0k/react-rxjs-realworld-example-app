import { distinctUntilChanged } from 'rxjs/operators'

import { createRxStateFactory } from 'lib/rx-store'

export type AccessToken = string | null

export type TokenEvents = {
  set: AccessToken
}

export const createToken = createRxStateFactory<AccessToken, TokenEvents>(
  (store, { set$ }) => [set$, distinctUntilChanged()]
)
