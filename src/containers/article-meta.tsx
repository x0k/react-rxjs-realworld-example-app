import React from 'react'

import { Article } from 'lib/conduit-client'

import { ArticleMeta } from 'components/article-meta'
import { Button, ButtonVariant } from 'components/button'

import { feed } from 'store'

export interface ArticleMetaContainerProps {
  article: Article
}

export function ArticleMetaContainer({ article }: ArticleMetaContainerProps) {
  const { favorited, favoritesCount } = article
  return (
    <ArticleMeta article={article}>
      <div className="pull-xs-right">
        <Button
          variant={
            favorited ? ButtonVariant.Primary : ButtonVariant.OutlinePrimary
          }
          onClick={() => feed.toggleFavorite(article)}
        >
          <i className="ion-heart" />
          &nbsp;{favoritesCount}
        </Button>
      </div>
    </ArticleMeta>
  )
}
