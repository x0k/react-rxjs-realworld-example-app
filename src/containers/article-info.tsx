import React from 'react'
import { Link } from 'react-router-dom'

import { Article } from 'lib/conduit-client'

import { getArticlePath } from 'models/path'

import { Tag } from 'components/tag'
import { TagsList } from 'components/tags-list'

export interface ArticleInfoContainerProps {
  article: Article
}

export function ArticleInfoContainer({
  article: { title, tagList, slug, description },
}: ArticleInfoContainerProps) {
  return (
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
  )
}
