import React, { useMemo } from 'react'

import { useRxState } from 'lib/store-rx-state'
import { useStartSignalHooks } from 'lib/store-rx-signals'

import { getFeedByTypePath, Path } from 'models/path'
import { FeedType } from 'models/feed'

import { NavItem } from 'components/nav-item'
import { NavLink } from 'components/nav-link'
import { Tabs } from 'components/tabs'

import { isNotUnauthorized$ } from 'store/user'
import {
  feedType$,
  feedTypeSet,
  FeedTypeStates,
} from 'store/feed-type'

const onSetYourFeed = () => feedTypeSet.next({
  type: FeedType.Your,
})

const onSetGlobalFeed = () => feedTypeSet.next({
  type: FeedType.Global,
})

export interface FeedTabsContainerProps {
  type?: FeedType.Your | FeedType.Global
  tag?: string
}

export function FeedTabsContainer({ type, tag }: FeedTabsContainerProps) {
  const isNotUnauthorized = useRxState(isNotUnauthorized$)
  const payload = useMemo<FeedTypeStates>(
    () =>
      type
        ? { type }
        : tag
        ? { type: FeedType.ByTag, tag }
        : { type: isNotUnauthorized ? FeedType.Your : FeedType.Global },
    [type, tag, isNotUnauthorized]
  )
  const hooks = useStartSignalHooks(feedTypeSet, payload)
  const feedType = useRxState(feedType$, hooks)
  return (
    <Tabs>
      {isNotUnauthorized && (
        <NavItem>
          <NavLink
            to={getFeedByTypePath(FeedType.Your)}
            active={feedType.type === FeedType.Your}
            onClick={onSetYourFeed}
          >
            Your Feed
          </NavLink>
        </NavItem>
      )}
      <NavItem>
        <NavLink
          to={getFeedByTypePath(FeedType.Global)}
          active={feedType.type === FeedType.Global}
          onClick={onSetGlobalFeed}
        >
          Global Feed
        </NavLink>
      </NavItem>
      {feedType.type === FeedType.ByTag && (
        <NavItem>
          <NavLink to={Path.Feed} active>
            <i className="ion-pound" />
            {feedType.tag}
          </NavLink>
        </NavItem>
      )}
    </Tabs>
  )
}
