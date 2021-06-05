import { distinctUntilChanged } from 'rxjs/operators'

import { createRxState } from 'lib/store-rx-state'
import { Store } from 'lib/store'
import { ObservableOf } from 'lib/store-rx-store'

export type AccessToken = string | null

export type TokenEvents = ObservableOf<{
  set: AccessToken
}>

export function createToken(store: Store<AccessToken>, { set$ }: TokenEvents) {
  return createRxState<AccessToken>(store, set$, distinctUntilChanged())
}
