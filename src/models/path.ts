import { ArticleSlug } from './article'
import { ProfileUsername } from './profile'

export enum Path {
  Home = '/',
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

export const getUserPath = (username: ProfileUsername) =>
  Path.Profile.replace(':username', username)
