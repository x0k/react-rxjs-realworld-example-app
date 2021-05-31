import React from 'react'

import { Article } from 'lib/conduit-client'

import { ArticlePreview } from 'components/article-preview'

import { ArticleInfoContainer } from 'containers/article-info'
import { ArticleMetaContainer } from 'containers/article-meta'

export function renderArticlePreview(article: Article) {
  return (
    <ArticlePreview>
      <ArticleMetaContainer article={article} />
      <ArticleInfoContainer article={article} />
    </ArticlePreview>
  )
}
