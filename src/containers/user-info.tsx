import React from 'react'
import { Link } from 'react-router-dom'

import { useRxState } from 'lib/store-rx-state'
import { foldState } from 'lib/state'

import { LoadableDataStatus } from 'models/loadable-data'

import { Container } from 'components/container'
import { Row } from 'components/row'
import { Button, ButtonVariant } from 'components/button'

import {
  isCurrentUser$,
  profileLoad,
  profile$,
  ProfileStates,
  ProfileUsername,
  profileToggleFollowing,
  profileCleanup,
} from 'store/profile'
import { useSignalsHooks } from 'lib/store-rx-signals'

export interface UserInfoContainerProps {
  username: ProfileUsername
}

export function UserInfoContainer({ username }: UserInfoContainerProps) {
  const hooks = useSignalsHooks(profileLoad, profileCleanup, username)
  const profileState = useRxState(profile$, hooks)
  const isCurrentUser = useRxState(isCurrentUser$)
  return foldState<LoadableDataStatus, ProfileStates, JSX.Element | null>({
    [LoadableDataStatus.Init]: () => null,
    [LoadableDataStatus.Loading]: () => null,
    [LoadableDataStatus.IDLE]: ({ data: { bio, image, username, following } }) => (
      <div className="user-info">
        <Container>
          <Row>
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img alt={username} className="user-img" src={image} />
              <h4>{username}</h4>
              {bio && <p>{bio}</p>}

              {isCurrentUser ? (
                <Link to="/settings">
                  <Button
                    variant={ButtonVariant.OutlineSecondary}
                    className="action-btn"
                  >
                    <i className="ion-gear-a" /> Edit Profile Settings
                  </Button>
                </Link>
              ) : (
                <Button
                  variant={ButtonVariant.Secondary}
                  onClick={() => profileToggleFollowing.next(username)}
                >
                  <i className="ion-plus-round" />
                  &nbsp;{following ? 'Unfollow' : 'Follow'} {username}
                </Button>
              )}
            </div>
          </Row>
        </Container>
      </div>
    ),
    [LoadableDataStatus.Error]: ({ error }) => <p>{error.message}</p>,
  })(profileState)
}
