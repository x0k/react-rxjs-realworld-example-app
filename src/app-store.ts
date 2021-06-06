import { Observable, Subscription } from 'rxjs'
import { Update } from 'history'

import { createLocalStorageStore, createMemoryStore } from 'lib/store'
import { createRxStore, createSubjects } from 'lib/rx-store'
import { TOKEN_KEY, LoadableDataStatus } from 'lib/models'
import {
  createToken,
  AccessToken,
  TokenEvents,
  createNavigation,
  NavigationEvents,
  createUser,
  UserStates,
  initialUserState,
  UserEvents,
  createIsNotUnauthorized,
  createTags,
  TagsStates,
  TagsEvents,
  createFeedType,
  initialFeedTypeState,
  FeedTypeEvents,
  createFeedPage,
  FeedPageEvents,
  createFeed,
  initialFeedState,
  FeedEvents,
  createAuth,
  initialAuthState,
  AuthEvents,
  createRegistration,
  initialRegistrationState,
  RegistrationEvents,
  createProfile,
  ProfileStates,
  ProfileEvents,
  createIsCurrentUser,
  createSettings,
  initialSettingsState,
  SettingsEvents,
  createEditor,
  initialEditorState,
  EditorEvents,
  createArticle,
  initialArticleState,
  ArticleEvents,
  createIsAuthor,
  createComments,
  initialCommentsState,
  CommentsEvents,
} from 'lib/app-store'

import { history } from './browser-history'
import {
  articleApi,
  commentsApi,
  defaultApi,
  favoriteApi,
  profileApi,
  userAndAuthenticationApi,
} from './api'

export const token = createRxStore(createToken, {
  store: createLocalStorageStore<AccessToken>(TOKEN_KEY, null),
  events: createSubjects<TokenEvents>(['set']),
})

export const navigation = createRxStore(
  createNavigation,
  {
    store: createMemoryStore<Update>(history),
    events: createSubjects<NavigationEvents>(['navigate']),
    sources: {
      update$: new Observable<Update>(
        (observer) =>
          new Subscription(history.listen((state) => observer.next(state)))
      ),
    },
  },
  history
)

export const user = createRxStore(
  createUser,
  {
    store: createMemoryStore<UserStates>(initialUserState),
    events: createSubjects<UserEvents>(['logIn', 'logOut', 'set']),
    sources: {
      token$: token.state$,
    },
    signals: { navigate: navigation.navigate, setToken: token.set },
  },
  userAndAuthenticationApi
)

export const isNotUnauthorized$ = createIsNotUnauthorized(user.state$)

export const tags = createRxStore(
  createTags,
  {
    store: createMemoryStore<TagsStates>({ type: LoadableDataStatus.Init }),
    events: createSubjects<TagsEvents>(['load', 'stop']),
  },
  defaultApi
)

export const feedType = createRxStore(createFeedType, {
  store: createMemoryStore(initialFeedTypeState),
  events: createSubjects<FeedTypeEvents>(['set']),
})

export const feedPage = createRxStore(createFeedPage, {
  store: createMemoryStore(1),
  events: createSubjects<FeedPageEvents>(['set']),
  sources: { feedType$: feedType.state$ },
})

export const feed = createRxStore(
  createFeed,
  {
    store: createMemoryStore(initialFeedState),
    events: createSubjects<FeedEvents>(['stop', 'toggleFavorite']),
    sources: {
      feedPage$: feedPage.state$,
      feedType$: feedType.state$,
    },
    signals: { setFeedType: feedType.set },
  },
  articleApi,
  favoriteApi
)

export const auth = createRxStore(
  createAuth,
  {
    store: createMemoryStore(initialAuthState),
    events: createSubjects<AuthEvents>(['changeField', 'signIn', 'stop']),
    sources: {
      navigate$: navigation.state$,
    },
    signals: { navigate: navigation.navigate, setUser: user.set },
  },
  userAndAuthenticationApi
)

export const registration = createRxStore(
  createRegistration,
  {
    store: createMemoryStore(initialRegistrationState),
    events: createSubjects<RegistrationEvents>([
      'changeField',
      'signUp',
      'stop',
    ]),
    sources: {
      navigate$: navigation.state$,
    },
    signals: { navigate: navigation.navigate, setUser: user.set },
  },
  userAndAuthenticationApi
)

export const profile = createRxStore(
  createProfile,
  {
    store: createMemoryStore<ProfileStates>({
      type: LoadableDataStatus.Init,
    }),
    events: createSubjects<ProfileEvents>(['load', 'stop', 'toggleFollowing']),
    sources: { user$: user.state$ },
  },
  profileApi
)

export const isCurrentUser$ = createIsCurrentUser(profile.state$, user.state$)

export const settings = createRxStore(
  createSettings,
  {
    store: createMemoryStore(initialSettingsState),
    events: createSubjects<SettingsEvents>(['changeField', 'stop', 'update']),
    sources: {
      user$: user.state$,
    },
    signals: { setUser: user.set },
  },
  userAndAuthenticationApi
)

export const editor = createRxStore(
  createEditor,
  {
    store: createMemoryStore(initialEditorState),
    events: createSubjects<EditorEvents>([
      'addTag',
      'changeField',
      'loadArticle',
      'publish',
      'removeTag',
      'stop',
    ]),
    signals: navigation,
  },
  articleApi
)

export const article = createRxStore(
  createArticle,
  {
    store: createMemoryStore(initialArticleState),
    events: createSubjects<ArticleEvents>([
      'delete',
      'load',
      'stop',
      'toggleFavorite',
      'toggleFollow',
    ]),
  },
  articleApi,
  profileApi,
  favoriteApi
)

export const isAuthor$ = createIsAuthor(article.state$, user.state$)

export const comments = createRxStore(
  createComments,
  {
    store: createMemoryStore(initialCommentsState),
    events: createSubjects<CommentsEvents>([
      'changeComment',
      'deleteComment',
      'postComment',
      'load',
      'stop',
    ]),
  },
  commentsApi
)
