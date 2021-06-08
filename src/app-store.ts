import { Observable, Subscription } from 'rxjs'
import { Update } from 'history'

import { createLocalStorageStore, createMemoryStore } from 'lib/store'
import { createSubjects } from 'lib/rx-store'
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

export const tokenSubjects = createSubjects<TokenEvents>(['set'])

export const token$ = createToken({
  store: createLocalStorageStore<AccessToken>(TOKEN_KEY, null),
  events: tokenSubjects,
})

export const navigationSubjects = createSubjects<NavigationEvents>(['navigate'])

export const navigation$ = createNavigation(
  {
    store: createMemoryStore<Update>(history),
    events: {
      ...navigationSubjects,
      update$: new Observable<Update>(
        (observer) =>
          new Subscription(history.listen((state) => observer.next(state)))
      ),
    },
  },
  history
)

export const userSubjects = createSubjects<UserEvents>([
  'logIn',
  'logOut',
  'set',
])

export const user$ = createUser(
  {
    store: createMemoryStore<UserStates>(initialUserState),
    events: {
      ...userSubjects,
      token$,
    },
    signals: {
      navigate$: navigationSubjects.navigate$,
      setToken$: tokenSubjects.set$,
    },
  },
  userAndAuthenticationApi
)

export const isNotUnauthorized$ = createIsNotUnauthorized(user$)

export const tagsSubjects = createSubjects<TagsEvents>(['load', 'stop'])

export const tags$ = createTags(
  {
    store: createMemoryStore<TagsStates>({ type: LoadableDataStatus.Init }),
    events: tagsSubjects,
  },
  defaultApi
)

export const feedTypeSubjects = createSubjects<FeedTypeEvents>(['set'])

export const feedType$ = createFeedType({
  store: createMemoryStore(initialFeedTypeState),
  events: feedTypeSubjects,
})

export const feedPageSubjects = createSubjects<FeedPageEvents>(['set'])

export const feedPage$ = createFeedPage({
  store: createMemoryStore(1),
  events: { ...feedPageSubjects, feedType$ },
})

export const feedSubjects = createSubjects<FeedEvents>([
  'stop',
  'toggleFavorite',
])

export const feed$ = createFeed(
  {
    store: createMemoryStore(initialFeedState),
    events: {
      ...feedSubjects,
      feedPage$,
      feedType$,
    },
    signals: { setFeedType$: feedTypeSubjects.set$ },
  },
  articleApi,
  favoriteApi
)

export const authSubjects = createSubjects<AuthEvents>([
  'changeField',
  'signIn',
  'stop',
])

export const auth$ = createAuth(
  {
    store: createMemoryStore(initialAuthState),
    events: {
      ...authSubjects,
      navigation$,
    },
    signals: {
      navigate$: navigationSubjects.navigate$,
      setUser$: userSubjects.set$,
    },
  },
  userAndAuthenticationApi
)

export const registrationSubjects = createSubjects<RegistrationEvents>([
  'changeField',
  'signUp',
  'stop',
])

export const registration$ = createRegistration(
  {
    store: createMemoryStore(initialRegistrationState),
    events: {
      ...registrationSubjects,
      navigation$,
    },
    signals: {
      navigate$: navigationSubjects.navigate$,
      setUser$: userSubjects.set$,
    },
  },
  userAndAuthenticationApi
)

export const profileSubjects = createSubjects<ProfileEvents>([
  'load',
  'stop',
  'toggleFollowing',
])

export const profile$ = createProfile(
  {
    store: createMemoryStore<ProfileStates>({
      type: LoadableDataStatus.Init,
    }),
    events: { ...profileSubjects, user$ },
  },
  profileApi
)

export const isCurrentUser$ = createIsCurrentUser(profile$, user$)

export const settingsSubjects = createSubjects<SettingsEvents>([
  'changeField',
  'stop',
  'update',
])

export const settings$ = createSettings(
  {
    store: createMemoryStore(initialSettingsState),
    events: {
      ...settingsSubjects,
      user$,
    },
    signals: { setUser$: userSubjects.set$ },
  },
  userAndAuthenticationApi
)

export const editorSubjects = createSubjects<EditorEvents>([
  'addTag',
  'changeField',
  'loadArticle',
  'publish',
  'removeTag',
  'stop',
])

export const editor$ = createEditor(
  {
    store: createMemoryStore(initialEditorState),
    events: editorSubjects,
    signals: navigationSubjects,
  },
  articleApi
)

export const articleSubjects = createSubjects<ArticleEvents>([
  'delete',
  'load',
  'stop',
  'toggleFavorite',
  'toggleFollow',
])

export const article$ = createArticle(
  {
    store: createMemoryStore(initialArticleState),
    events: articleSubjects,
  },
  articleApi,
  profileApi,
  favoriteApi
)

export const isAuthor$ = createIsAuthor(article$, user$)

export const commentsSubjects = createSubjects<CommentsEvents>([
  'changeComment',
  'deleteComment',
  'postComment',
  'load',
  'stop',
])

export const comments$ = createComments(
  {
    store: createMemoryStore(initialCommentsState),
    events: commentsSubjects,
  },
  commentsApi
)
