import React from 'react'
import { Link } from 'react-router-dom'

import { Article } from 'lib/conduit-client'
import { useRxState } from 'lib/rx-store-react'

import { Path } from 'models/path'

import { Button, ButtonSize, ButtonVariant } from 'components/button'

import { article, isAuthor$ } from 'store'

export interface ArticleActionsContainerProps {
  article: Article
}

export function ArticleActionsContainer({
  article: {
    slug,
    favorited,
    favoritesCount,
    author: { username, following },
  },
}: ArticleActionsContainerProps) {
  const isAuthor = useRxState(isAuthor$)
  return isAuthor ? (
    <span>
      <Link to={`/${Path.Editor}/${slug}`}>
        <Button variant={ButtonVariant.OutlineSecondary}>
          <i className="ion-edit" /> Edit Article
        </Button>
      </Link>
      &nbsp;
      <Button variant={ButtonVariant.OutlineDanger} onClick={article.delete}>
        <i className="ion-trash-a" /> Delete Article
      </Button>
    </span>
  ) : (
    <span>
      <Button
        size={ButtonSize.Small}
        variant={
          following ? ButtonVariant.Secondary : ButtonVariant.OutlineSecondary
        }
        onClick={article.toggleFollow}
      >
        <i className="ion-plus-round" /> {following ? 'Unfollow' : 'Follow'}
        &nbsp;
        {username}
      </Button>
      &nbsp;
      <Button
        size={ButtonSize.Small}
        variant={
          favorited ? ButtonVariant.Primary : ButtonVariant.OutlinePrimary
        }
        onClick={article.toggleFavorite}
      >
        <i className="ion-heart" /> {favorited ? 'Unfavorite' : 'Favorite'}
        &nbsp; Article ({favoritesCount})
      </Button>
    </span>
  )
}
