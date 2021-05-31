import { Subject } from 'rxjs'

import { State } from 'lib/state'
import { createMemoryStore } from 'lib/store'
import { createRxState } from 'lib/store-rx-state'

import { ProfileUsername } from 'models/profile'

import { Tag } from './tags'

export enum FeedType {
  Global = 'global',
  ByTag = 'byTag',
  ByAuthor = 'byAuthor',
  Favorite = 'favorite',
  Your = 'your',
}

export type FeedTypeStates =
  | State<FeedType.Global>
  | State<FeedType.ByTag, { tag: Tag }>
  | State<FeedType.ByAuthor, { author: ProfileUsername }>
  | State<FeedType.Favorite, { favorited: ProfileUsername }>
  | State<FeedType.Your>

export const store = createMemoryStore<FeedTypeStates>({
  type: FeedType.Global,
})

export const feedTypeSet = new Subject<FeedTypeStates>()

export const feedType$ = createRxState(store, feedTypeSet)
