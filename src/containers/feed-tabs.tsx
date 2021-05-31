import React from 'react'

import { useRxState } from 'lib/store-rx-state'

import { getTagPath, Path } from 'models/path'

import { NavItem } from 'components/nav-item'
import { NavLink } from 'components/nav-link'
import { Tabs } from 'components/tabs'

import { Tag } from 'store/tags'
import { isNotUnauthorized$ } from 'store/user'

export interface FeedTabsContainerProps {
  tag?: Tag
}

export function FeedTabsContainer({ tag }: FeedTabsContainerProps) {
  const isNotUnauthorized = useRxState(isNotUnauthorized$)
  return (
    <Tabs>
      {isNotUnauthorized && (
        <NavItem>
          <NavLink to={Path.YourFeed}>Your Feed</NavLink>
        </NavItem>
      )}
      <NavItem>
        <NavLink to={Path.GlobalFeed}>Global Feed</NavLink>
      </NavItem>
      {tag && (
        <NavItem>
          <NavLink to={getTagPath(tag)}>
            <i className="ion-pound" />
            {tag}
          </NavLink>
        </NavItem>
      )}
    </Tabs>
  )
}
