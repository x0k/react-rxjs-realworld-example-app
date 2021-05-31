import { Subject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

import { createRxState } from 'lib/store-rx-state'
import { createLocalStorageStore } from 'lib/store'

import { TOKEN_KEY } from 'models/app'

export type AccessToken = string | null

export const tokenSet = new Subject<AccessToken>()

const store = createLocalStorageStore<AccessToken>(TOKEN_KEY, null)

export const token$ = createRxState<AccessToken>(
  store,
  tokenSet,
  distinctUntilChanged()
)
