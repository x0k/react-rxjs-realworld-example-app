import React from 'react'
import Markdown from 'markdown-to-jsx'
import { useParams } from 'react-router-dom'

import { Article } from 'lib/conduit-client'

import { ArticleMeta } from 'components/article-meta'
import { Banner } from 'components/banner'
import { Container } from 'components/container'
import { Page } from 'components/page'
import { Row } from 'components/row'

import { ArticleContainer } from 'containers/article'
import { ArticleActionsContainer } from 'containers/article-actions'
import { CommentsContainer } from 'containers/comments'
import { ArticleTagsContainer } from 'containers/article-tags'

const markdownOptions = { forceBlock: true }

function renderArticle(article: Article) {
  const { title, body } = article
  const actions = (
    <ArticleMeta article={article}>
      <ArticleActionsContainer article={article} />
    </ArticleMeta>
  )
  return (
    <>
      <Banner>
        <Container>
          <h1>{title}</h1>
          {actions}
        </Container>
      </Banner>
      <Page>
        <Row className="article-content">
          <div className="col-xs-12">
            <Markdown options={markdownOptions}>{body}</Markdown>
            <ArticleTagsContainer article={article} />
          </div>
        </Row>
        <hr />
        <div className="article-actions">{actions}</div>
        <Row>
          <div className="col-xs-12 col-md-8 offset-md-2">
            <CommentsContainer article={article} />
          </div>
        </Row>
      </Page>
    </>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()
  return (
    <div className="article-page">
      <ArticleContainer slug={slug}>{renderArticle}</ArticleContainer>
    </div>
  )
}
