import React, { useMemo } from 'react'

import { foldState } from 'lib/state'
import { useRxState } from 'lib/rx-store-react'
import { getProfilePath, Path } from 'lib/models'
import { UserStates, UserStatus } from 'lib/app-store'

import { NavBar } from 'components/navbar'
import { NavItem } from 'components/nav-item'
import { NavLink } from 'components/nav-link'

import { user } from 'app-store'

const foldUserState = foldState<UserStatus, UserStates, JSX.Element | null>({
  [UserStatus.Unknown]: () => null,
  [UserStatus.LogIn]: () => null,
  [UserStatus.Authorized]: ({ user }) => (
    <NavBar>
      <NavItem>
        <NavLink to={Path.Feed} end>
          Home
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to={Path.Editor}>
          <i className="ion-compose" />
          &nbsp;New Article
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to={Path.Settings}>
          <i className="ion-gear-a" />
          &nbsp;Settings
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to={getProfilePath(user.username)}>
          {user.image && (
            <img alt={user.username} className="user-pic" src={user.image} />
          )}
          {user.username}
        </NavLink>
      </NavItem>
    </NavBar>
  ),
  [UserStatus.Unauthorized]: () => (
    <NavBar>
      <NavItem>
        <NavLink to={Path.Feed} end>
          Home
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to={Path.Login}>Sign In</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to={Path.Registration}>Sign Up</NavLink>
      </NavItem>
    </NavBar>
  ),
})

export function NavBarContainer() {
  const userState = useRxState(user.state$)
  return useMemo(() => foldUserState(userState), [userState])
}
