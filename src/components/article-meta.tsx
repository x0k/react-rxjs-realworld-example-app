import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import { Article } from 'lib/conduit-client'
export interface ArticleMetaProps {
  article: Article
}

export const ArticleMeta: FunctionComponent<ArticleMetaProps> = ({
  article: {
    author: { username, image },
    createdAt,
  },
  children,
}) => (
  <div className="article-meta">
    <Link to={`/@${username}`}>
      <img alt={username} src={image} />
    </Link>

    <div className="info">
      <Link className="author" to={`/@${username}`}>
        {username}
      </Link>
      <span className="date">{new Date(createdAt).toDateString()}</span>
    </div>
    {children}
  </div>
)
