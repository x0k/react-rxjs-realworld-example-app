import { merge } from 'rxjs'
import { distinctUntilChanged, mapTo } from 'rxjs/operators'

import { Store } from 'lib/store'
import { ObservableOf, createRxState } from 'lib/rx-store'

import { FeedTypeStates } from './feed-type'

export type FeedPageEvents = {
  set: number
}

export type FeedPageSources = {
  feedType: FeedTypeStates
}

export function createFeedPage(
  store: Store<number>,
  { set$, feedType$ }: ObservableOf<FeedPageEvents & FeedPageSources>
) {
  return createRxState(
    store,
    merge(set$, feedType$.pipe(mapTo(1))),
    distinctUntilChanged()
  )
}
