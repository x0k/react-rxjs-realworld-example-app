import { distinctUntilChanged } from 'rxjs/operators'

import { createRxStateFactory, StateOptions } from 'lib/rx-store'

export type AccessToken = string | null

export type TokenEvents = {
  set: AccessToken
}

export const createToken = createRxStateFactory(
  ({ events: { set$ } }: StateOptions<AccessToken, TokenEvents>) => [
    set$,
    distinctUntilChanged<AccessToken>(),
  ]
)
