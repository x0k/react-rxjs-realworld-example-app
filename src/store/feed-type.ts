import { Subject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

import { SelectState, State } from 'lib/state'
import { createMemoryStore } from 'lib/store'
import { createRxState } from 'lib/store-rx-state'

import { ProfileUsername } from 'models/profile'
import { FeedType } from 'models/feed'

import { Tag } from './tags'

export type FeedTypeStates =
  | State<FeedType.Global>
  | State<FeedType.ByTag, { tag: Tag }>
  | State<FeedType.ByAuthor, { author: ProfileUsername }>
  | State<FeedType.Favorite, { favorited: ProfileUsername }>
  | State<FeedType.Your>

export function compareFeedState(a: FeedTypeStates, b: FeedTypeStates) {
  if (a.type !== b.type) {
    return false
  }
  switch (a.type) {
    case FeedType.ByTag:
      return a.tag === (b as SelectState<FeedTypeStates, FeedType.ByTag>).tag
    case FeedType.ByAuthor:
      return (
        a.author ===
        (b as SelectState<FeedTypeStates, FeedType.ByAuthor>).author
      )
    case FeedType.Favorite:
      return (
        a.favorited ===
        (b as SelectState<FeedTypeStates, FeedType.Favorite>).favorited
      )
    default:
      return true
  }
}

export const store = createMemoryStore<FeedTypeStates>({
  type: FeedType.Global,
})

export const feedTypeSet = new Subject<FeedTypeStates>()

export const feedType$ = createRxState(
  store,
  feedTypeSet,
  distinctUntilChanged(compareFeedState)
)
