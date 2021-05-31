import { merge, Subject } from 'rxjs'
import { mapTo } from 'rxjs/operators'

import { createMemoryStore } from 'lib/store'
import { createRxState } from 'lib/store-rx-state'

import { feedType$ } from './feed-type'

const store = createMemoryStore(1)

export const feedPageSet = new Subject<number>()

export const feedPage$ = createRxState(
  store,
  merge(feedPageSet, feedType$.pipe(mapTo(1)))
)
