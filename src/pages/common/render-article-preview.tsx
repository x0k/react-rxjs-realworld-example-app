import React from 'react'
import { Link } from 'react-router-dom'

import { Article } from 'lib/conduit-client'

import { getArticlePath } from 'models/path'

import { ArticlePreview } from 'components/article-preview'
import { Tag } from 'components/tag'
import { TagsList } from 'components/tags-list'

import { ArticleMetaContainer } from 'containers/article-meta'

export function renderArticlePreview(article: Article) {
  const { title, tagList, slug, description } = article
  return (
    <ArticlePreview>
      <ArticleMetaContainer article={article} />
      <Link className="preview-link" to={getArticlePath(slug)}>
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <TagsList>
          {tagList.map((tag) => (
            <Tag as="li" outline key={tag}>
              {tag}
            </Tag>
          ))}
        </TagsList>
      </Link>
    </ArticlePreview>
  )
}
