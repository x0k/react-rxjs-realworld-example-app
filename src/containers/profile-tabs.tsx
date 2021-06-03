import React, { useCallback, useMemo } from 'react'

import { useStartSignalHooks } from 'lib/store-rx-signals'
import { useRxState } from 'lib/store-rx-state'

import { ProfileUsername } from 'models/profile'
import { FeedType, ProfileFeedByType } from 'models/feed'
import { getProfileFeedByTypePath } from 'models/path'

import { Tabs } from 'components/tabs'
import { NavItem } from 'components/nav-item'
import { NavLink } from 'components/nav-link'

import { FeedTypeStates, feedTypeSet, feedType$ } from 'store/feed-type'

export interface ProfileTabsContainerProps {
  username: ProfileUsername
  type?: ProfileFeedByType
}

export function ProfileTabsContainer({
  username,
  type,
}: ProfileTabsContainerProps) {
  const payload = useMemo<FeedTypeStates>(
    () =>
      type === FeedType.Favorite
        ? { type: FeedType.Favorite, favorited: username }
        : { type: FeedType.ByAuthor, author: username },
    [username, type]
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
    <Tabs className="articles-toggle">
      <NavItem>
        <NavLink
          to={getProfileFeedByTypePath(username, FeedType.ByAuthor)}
          active={feedType.type === FeedType.ByAuthor}
          onClick={onMyArticles}
        >
          My Articles
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          to={getProfileFeedByTypePath(username, FeedType.Favorite)}
          active={feedType.type === FeedType.Favorite}
          onClick={onFavorites}
        >
          Favorited Articles
        </NavLink>
      </NavItem>
    </Tabs>
  )
}
