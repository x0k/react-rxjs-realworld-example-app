import React, { useCallback, useMemo } from 'react'

import { useRxState, useStartSignalHooks } from 'lib/rx-store-react'

import { ProfileUsername } from 'models/profile'
import { FeedType, ProfileFeedByType } from 'models/feed'
import { getProfileFeedByTypePath } from 'models/path'

import { Tabs } from 'components/tabs'
import { NavItem } from 'components/nav-item'
import { NavLink } from 'components/nav-link'

import { feedType } from 'store'
import { FeedTypeStates } from 'store/feed-type'

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
  const hooks = useStartSignalHooks(feedType.set, payload)
  const state = useRxState(feedType.state$, hooks)
  const onMyArticles = useCallback(
    () => feedType.set({ type: FeedType.ByAuthor, author: username }),
    [username]
  )
  const onFavorites = useCallback(
    () => feedType.set({ type: FeedType.Favorite, favorited: username }),
    [username]
  )
  return (
    <Tabs className="articles-toggle">
      <NavItem>
        <NavLink
          to={getProfileFeedByTypePath(username, FeedType.ByAuthor)}
          active={state.type === FeedType.ByAuthor}
          onClick={onMyArticles}
        >
          My Articles
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          to={getProfileFeedByTypePath(username, FeedType.Favorite)}
          active={state.type === FeedType.Favorite}
          onClick={onFavorites}
        >
          Favorited Articles
        </NavLink>
      </NavItem>
    </Tabs>
  )
}
