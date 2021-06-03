import React from 'react'

import { Article } from 'lib/conduit-client'

import { getFeedByTagPath } from 'models/path'

import { Tag } from 'components/tag'
import { TagsList } from 'components/tags-list'

export interface ArticleTagsProps {
  article: Article
}

export function ArticleTagsContainer({
  article: { tagList },
}: ArticleTagsProps) {
  return (
    <TagsList>
      {tagList.map((tag) => (
        <Tag to={getFeedByTagPath(tag)} outline key={tag}>
          {tag}
        </Tag>
      ))}
    </TagsList>
  )
}
