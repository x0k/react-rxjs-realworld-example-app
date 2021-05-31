import React, { useCallback, useMemo } from 'react'

import { useStartSignalHooks } from 'lib/store-rx-signals'
import { useRxState } from 'lib/store-rx-state'

import { ProfileUsername } from 'models/profile'

import { Tabs } from 'components/tabs'
import { NavItem } from 'components/nav-item'
import { NavLink } from 'components/nav-link'

import {
  FeedTypeStates,
  FeedType,
  feedTypeSet,
  feedType$,
} from 'store/feed-type'

export interface ProfileTabsContainerProps {
  favorites?: boolean
  username: ProfileUsername
}

export function ProfileTabsContainer({
  favorites,
  username,
}: ProfileTabsContainerProps) {
  const payload = useMemo<FeedTypeStates>(
    () =>
      favorites
        ? { type: FeedType.Favorite, favorited: username }
        : { type: FeedType.ByAuthor, author: username },
    [favorites, username]
  )
  const hooks = useStartSignalHooks(feedTypeSet, payload)
  const feedType = useRxState(feedType$, hooks)
  const onMyArticles = useCallback(
    () => feedTypeSet.next({ type: FeedType.ByAuthor, author: username }),
    [username]
  )
  const onFavorites = useCallback(
    () => feedTypeSet.next({ type: FeedType.Favorite, favorited: username }),
    [username]
  )
  return (
    <Tabs>
      <NavItem>
        <NavLink
          active={feedType.type === FeedType.ByAuthor}
          onClick={onMyArticles}
        >
          My Articles
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          active={feedType.type === FeedType.Favorite}
          onClick={onFavorites}
        >
          Favorited Articles
        </NavLink>
      </NavItem>
    </Tabs>
  )
}
