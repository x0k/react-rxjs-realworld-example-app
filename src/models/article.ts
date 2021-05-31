import { Article } from 'lib/conduit-client'

export type ArticleSlug = Article['slug']

export type ArticleTag = Article['tagList'][number]
