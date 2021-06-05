import { distinctUntilChanged } from 'rxjs/operators'

import { SelectState, State } from 'lib/state'
import { createRxStateFactory } from 'lib/rx-store'

import { ProfileUsername } from 'models/profile'
import { FeedType } from 'models/feed'

import { Tag } from './tags'

export type FeedTypeStates =
  | State<FeedType.Unknown>
  | State<FeedType.Global>
  | State<FeedType.ByTag, { tag: Tag }>
  | State<FeedType.ByAuthor, { author: ProfileUsername }>
  | State<FeedType.Favorite, { favorited: ProfileUsername }>
  | State<FeedType.Your>

export const initialFeedTypeState: FeedTypeStates = {
  type: FeedType.Unknown,
}

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

export type FeedTypeEvents = {
  set: FeedTypeStates
}

export const createFeedType = createRxStateFactory<
  FeedTypeStates,
  FeedTypeEvents
>((store, { set$ }) => [set$, distinctUntilChanged(compareFeedState)])
