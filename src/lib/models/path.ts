import { ArticleSlug, ArticleTag } from './article'
import { FeedByType, ProfileFeedByType } from './feed'
import { ProfileUsername } from './profile'

export enum Path {
  Feed = '/',
  Login = '/login',
  Registration = '/registration',
  Settings = '/settings',
  Editor = '/editor',
  EditorCreate = '/',
  EditorSlug = ':slug',
  Profile = '/@:username',
  ProfileArticles = '/',
  ProfileFavorites = 'favorites',
  Article = '/article/:slug',
}

export const getArticlePath = (slug: ArticleSlug) =>
  Path.Article.replace(':slug', slug)

export const getProfilePath = (username: ProfileUsername) =>
  Path.Profile.replace(':username', username)

export const getFeedByTypePath = (type: FeedByType) =>
  `${Path.Feed}?type=${type}`

export const getFeedByTagPath = (tag: ArticleTag) => `${Path.Feed}?tag=${tag}`

export const getProfileFeedByTypePath = (
  username: ProfileUsername,
  type: ProfileFeedByType
) => `${getProfilePath(username)}?type=${type}`
