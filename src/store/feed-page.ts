import { merge } from 'rxjs'
import { distinctUntilChanged, mapTo } from 'rxjs/operators'

import { createRxStateFactory } from 'lib/rx-store'

import { FeedTypeStates } from './feed-type'

export type FeedPageEvents = {
  set: number
}

export type FeedPageSources = {
  feedType: FeedTypeStates
}

export const createFeedPage = createRxStateFactory<
  number,
  FeedPageEvents & FeedPageSources
>((store, { set$, feedType$ }) => [
  merge(set$, feedType$.pipe(mapTo(1))),
  distinctUntilChanged(),
])
