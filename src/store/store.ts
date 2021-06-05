import { Observable, Subscription } from 'rxjs'
import { BrowserHistory, Update } from 'history'

import { createLocalStorageStore, createMemoryStore } from 'lib/store'
import { createRxStore } from 'lib/rx-store'
import { history } from 'lib/history'
import {
  articleApi,
  commentsApi,
  defaultApi,
  favoriteApi,
  profileApi,
  userAndAuthenticationApi,
} from 'lib/api'
import {
  ArticlesApi,
  FavoritesApi,
  ProfileApi,
  UserAndAuthenticationApi,
} from 'lib/conduit-client'

import { TOKEN_KEY } from 'models/app'
import { LoadableDataStatus } from 'models/loadable-data'

import {
  createNavigation,
  NavigationEvents,
  NavigationSources,
} from './navigation'
import { AccessToken, createToken } from './token'
import {
  createIsNotUnauthorized,
  createUser,
  UserEvents,
  UserSignals,
  UserSources,
  UserStates,
  UserStatus,
} from './user'
import { createTags, TagsStates } from './tags'
import {
  createFeed,
  FeedEvents,
  FeedSignals,
  FeedSources,
  FeedState,
  initialFeedState,
} from './feed'
import { createFeedType, initialFeedTypeState } from './feed-type'
import { createFeedPage, FeedPageEvents, FeedPageSources } from './feed-page'
import {
  AuthEvents,
  AuthSignals,
  AuthSources,
  AuthState,
  createAuth,
  initialAuthState,
} from './auth'
import {
  createRegistration,
  initialRegistrationState,
  RegistrationEvents,
  RegistrationSignals,
  RegistrationSources,
  RegistrationState,
} from './registration'
import {
  createIsCurrentUser,
  createProfile,
  ProfileEvents,
  ProfileSources,
  ProfileStates,
} from './profile'
import {
  createSettings,
  initialSettingsState,
  SettingsEvents,
  SettingsSignals,
  SettingsSources,
  SettingsState,
} from './settings'
import { createEditor, initialEditorState } from './editor'
import { createArticle, createIsAuthor, initialArticleState } from './article'
import { createComments, initialCommentsState } from './comments'

export const token = createRxStore(
  createToken,
  createLocalStorageStore<AccessToken>(TOKEN_KEY, null),
  ['set']
)()

export const navigation = createRxStore<
  Update,
  NavigationEvents,
  NavigationSources,
  [BrowserHistory]
>(createNavigation, createMemoryStore<Update>(history), ['navigate'], {
  update$: new Observable<Update>(
    (observer) =>
      new Subscription(history.listen((state) => observer.next(state)))
  ),
})(history)

export const user = createRxStore<
  UserStates,
  UserEvents,
  UserSources,
  [UserSignals, UserAndAuthenticationApi]
>(
  createUser,
  createMemoryStore<UserStates>({ type: UserStatus.Unknown }),
  ['logIn', 'logOut', 'set'],
  {
    token$: token.state$,
  }
)(
  { navigate: navigation.navigate, setToken: token.set },
  userAndAuthenticationApi
)

export const isNotUnauthorized$ = createIsNotUnauthorized(user.state$)

export const tags = createRxStore(
  createTags,
  createMemoryStore<TagsStates>({ type: LoadableDataStatus.Init }),
  ['load', 'stop']
)(defaultApi)

export const feedType = createRxStore(
  createFeedType,
  createMemoryStore(initialFeedTypeState),
  ['set']
)()

export const feedPage = createRxStore<number, FeedPageEvents, FeedPageSources>(
  createFeedPage,
  createMemoryStore(1),
  ['set'],
  { feedType$: feedType.state$ }
)()

export const feed = createRxStore<
  FeedState,
  FeedEvents,
  FeedSources,
  [FeedSignals, ArticlesApi, FavoritesApi]
>(createFeed, createMemoryStore(initialFeedState), ['stop', 'toggleFavorite'], {
  feedPage$: feedPage.state$,
  feedType$: feedType.state$,
})({ setFeedType: feedType.set }, articleApi, favoriteApi)

export const auth = createRxStore<
  AuthState,
  AuthEvents,
  AuthSources,
  [AuthSignals, UserAndAuthenticationApi]
>(
  createAuth,
  createMemoryStore(initialAuthState),
  ['changeField', 'signIn', 'stop'],
  {
    navigate$: navigation.state$,
  }
)(
  { navigate: navigation.navigate, setUser: user.set },
  userAndAuthenticationApi
)

export const registration = createRxStore<
  RegistrationState,
  RegistrationEvents,
  RegistrationSources,
  [RegistrationSignals, UserAndAuthenticationApi]
>(
  createRegistration,
  createMemoryStore(initialRegistrationState),
  ['changeField', 'signUp', 'stop'],
  {
    navigate$: navigation.state$,
  }
)(
  { navigate: navigation.navigate, setUser: user.set },
  userAndAuthenticationApi
)

export const profile = createRxStore<
  ProfileStates,
  ProfileEvents,
  ProfileSources,
  [ProfileApi]
>(
  createProfile,
  createMemoryStore<ProfileStates>({
    type: LoadableDataStatus.Init,
  }),
  ['load', 'stop', 'toggleFollowing'],
  { user$: user.state$ }
)(profileApi)

export const isCurrentUser$ = createIsCurrentUser(profile.state$, user.state$)

export const settings = createRxStore<
  SettingsState,
  SettingsEvents,
  SettingsSources,
  [SettingsSignals, UserAndAuthenticationApi]
>(
  createSettings,
  createMemoryStore(initialSettingsState),
  ['changeField', 'stop', 'update'],
  {
    user$: user.state$,
  }
)({ setUser: user.set }, userAndAuthenticationApi)

export const editor = createRxStore(
  createEditor,
  createMemoryStore(initialEditorState),
  ['addTag', 'changeField', 'loadArticle', 'publish', 'removeTag', 'stop']
)(navigation, articleApi)

export const article = createRxStore(
  createArticle,
  createMemoryStore(initialArticleState),
  ['delete', 'load', 'stop', 'toggleFavorite', 'toggleFollow']
)(articleApi, profileApi, favoriteApi)

export const isAuthor$ = createIsAuthor(article.state$, user.state$)

export const comments = createRxStore(
  createComments,
  createMemoryStore(initialCommentsState),
  ['changeComment', 'deleteComment', 'postComment', 'load', 'stop']
)(commentsApi)
