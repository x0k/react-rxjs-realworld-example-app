import { ArticleSlug, ArticleTag } from './article'

export enum Path {
  Home = '/',
  GlobalFeed = '/global-feed',
  YourFeed = '/your-feed',
  FeedByTag = '/feed-by-tag',
  Login = '/login',
  Registration = '/registration',
  Settings = '/settings',
  Editor = '/editor',
  EditorCreate = '/',
  EditorSlug = ':slug',
  Profile = '/@:username',
  ProfileArticles = 'articles',
  ProfileFavorites = 'favorites',
  Article = '/article/:slug',
}

export const getArticlePath = (slug: ArticleSlug) => Path.Article.replace(':slug', slug)

export const getTagPath = (tag: ArticleTag) => `/${Path.FeedByTag}?tag=${tag}`
