import React from 'react'

import { useRxState } from 'lib/store-rx-state'

import { NavItem } from 'components/nav-item'
import { NavLink } from 'components/nav-link'
import { Tabs } from 'components/tabs'

import { isNotUnauthorized$ } from 'store/user'
import { FeedType, feedType$, feedTypeSet } from 'store/feed-type'

const onSetYourFeed = () => feedTypeSet.next({ type: FeedType.Your })

const onSetGlobalFeed = () => feedTypeSet.next({ type: FeedType.Global })

export function FeedTabsContainer() {
  const isNotUnauthorized = useRxState(isNotUnauthorized$)
  const feedType = useRxState(feedType$)
  return (
    <Tabs>
      {isNotUnauthorized && (
        <NavItem>
          <NavLink
            active={feedType.type === FeedType.Your}
            onClick={onSetYourFeed}
          >
            Your Feed
          </NavLink>
        </NavItem>
      )}
      <NavItem>
        <NavLink
          active={feedType.type === FeedType.Global}
          onClick={onSetGlobalFeed}
        >
          Global Feed
        </NavLink>
      </NavItem>
      {feedType.type === FeedType.ByTag && (
        <NavItem>
          <NavLink active>
            <i className="ion-pound" />
            {feedType.tag}
          </NavLink>
        </NavItem>
      )}
    </Tabs>
  )
}
