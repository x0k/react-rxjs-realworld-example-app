import { distinctUntilChanged } from 'rxjs/operators'

import { Store } from 'lib/store'
import { createRxState, ObservableOf } from 'lib/rx-store'

export type AccessToken = string | null

export type TokenEvents = ObservableOf<{
  set: AccessToken
}>

export function createToken(store: Store<AccessToken>, { set$ }: TokenEvents) {
  return createRxState<AccessToken>(store, set$, distinctUntilChanged())
}
