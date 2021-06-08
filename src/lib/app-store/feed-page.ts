import { merge } from 'rxjs'
import { distinctUntilChanged, mapTo } from 'rxjs/operators'

import { createRxStateFactory, StateHandlers, StateOptions } from 'lib/rx-store'

import { FeedTypeStates } from './feed-type'

export type FeedPageEvents = {
  set: number
}

export type FeedPageSources = {
  feedType: FeedTypeStates
}

export const createFeedPage = createRxStateFactory(
  ({
    events: { set$, feedType$ },
  }: StateOptions<
    number,
    FeedPageEvents & FeedPageSources
  >): StateHandlers<number> => [
    merge(set$, feedType$.pipe(mapTo(1))),
    distinctUntilChanged(),
  ]
)
