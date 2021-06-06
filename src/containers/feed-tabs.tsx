import React, { useMemo } from 'react'

import { useRxState, useStartSignalHooks } from 'lib/rx-store-react'
import { getFeedByTypePath, Path, FeedType } from 'lib/models'
import { FeedTypeStates } from 'lib/app-store'

import { NavItem } from 'components/nav-item'
import { NavLink } from 'components/nav-link'
import { Tabs } from 'components/tabs'

import { feedType, isNotUnauthorized$ } from 'app-store'

const onSetYourFeed = () =>
  feedType.set({
    type: FeedType.Your,
  })

const onSetGlobalFeed = () =>
  feedType.set({
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
  const hooks = useStartSignalHooks(feedType.set, payload)
  const state = useRxState(feedType.state$, hooks)
  return (
    <Tabs>
      {isNotUnauthorized && (
        <NavItem>
          <NavLink
            to={getFeedByTypePath(FeedType.Your)}
            active={state.type === FeedType.Your}
            onClick={onSetYourFeed}
          >
            Your Feed
          </NavLink>
        </NavItem>
      )}
      <NavItem>
        <NavLink
          to={getFeedByTypePath(FeedType.Global)}
          active={state.type === FeedType.Global}
          onClick={onSetGlobalFeed}
        >
          Global Feed
        </NavLink>
      </NavItem>
      {state.type === FeedType.ByTag && (
        <NavItem>
          <NavLink to={Path.Feed} active>
            <i className="ion-pound" />
            {state.tag}
          </NavLink>
        </NavItem>
      )}
    </Tabs>
  )
}
