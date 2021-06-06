import { combineLatest, merge, Observable } from 'rxjs'
import {
  exhaustMap,
  filter,
  map,
  mapTo,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators'

import {
  Article,
  ArticlesApi,
  FavoritesApi,
  ProfileApi,
  ProfileResponse,
  SingleArticleResponse,
} from 'lib/conduit-client'
import { isSpecificState } from 'lib/state'
import { createRxStateFactory, StateHandlers, StateOptions } from 'lib/rx-store'

import {
  catchGenericAjaxErrorForLoadableData,
  LoadableDataStates,
  LoadableDataStatus,
} from 'models/loadable-data'
import { GenericAjaxError } from 'models/errors'
import { ArticleSlug } from 'models/article'

import { UserStates, UserStatus } from './user'

export type ArticleStates = LoadableDataStates<Article, GenericAjaxError>

const singleArticleResponseToState = map<SingleArticleResponse, ArticleStates>(
  ({ article }) => ({
    type: LoadableDataStatus.IDLE,
    data: article,
  })
)

export const initialArticleState: ArticleStates = {
  type: LoadableDataStatus.Init,
}

export type ArticleEvents = {
  load: ArticleSlug
  stop: unknown
  delete: unknown
  toggleFollow: unknown
  toggleFavorite: unknown
}

export const createArticle = createRxStateFactory(
  (
    {
      events: { delete$, load$, stop$, toggleFavorite$, toggleFollow$ },
      store,
    }: StateOptions<ArticleStates, ArticleEvents>,
    api: ArticlesApi,
    profileApi: ProfileApi,
    favoriteApi: FavoritesApi
  ): StateHandlers<ArticleStates> => [
    merge(
      load$.pipe(mapTo({ type: LoadableDataStatus.Loading })),
      load$.pipe(
        switchMap((slug) => api.getArticle({ slug })),
        singleArticleResponseToState,
        catchGenericAjaxErrorForLoadableData
      ),
      delete$.pipe(
        map(() => store.state),
        filter(isSpecificState(LoadableDataStatus.IDLE)),
        exhaustMap(({ data }) => api.deleteArticle(data)),
        mapTo<void, ArticleStates>({ type: LoadableDataStatus.Init }),
        catchGenericAjaxErrorForLoadableData
      ),
      toggleFollow$.pipe(
        map(() => store.state),
        filter(isSpecificState(LoadableDataStatus.IDLE)),
        exhaustMap(({ data }) => {
          const {
            author: { following, username },
          } = data
          return (
            following
              ? profileApi.unfollowUserByUsername({ username })
              : profileApi.followUserByUsername({ username })
          ).pipe(
            map<ProfileResponse, ArticleStates>(({ profile }) => ({
              type: LoadableDataStatus.IDLE,
              data: { ...data, author: profile },
            }))
          )
        }),
        catchGenericAjaxErrorForLoadableData
      ),
      toggleFavorite$.pipe(
        map(() => store.state),
        filter(isSpecificState(LoadableDataStatus.IDLE)),
        exhaustMap(({ data: { favorited, slug } }) => {
          return favorited
            ? favoriteApi.deleteArticleFavorite({ slug })
            : favoriteApi.createArticleFavorite({ slug })
        }),
        singleArticleResponseToState,
        catchGenericAjaxErrorForLoadableData
      )
    ),
    takeUntil(stop$.pipe(tap(() => store.set(initialArticleState)))),
  ]
)

export const createIsAuthor = (
  article$: Observable<ArticleStates>,
  user$: Observable<UserStates>
) =>
  combineLatest([article$, user$]).pipe(
    map(
      ([article, user]) =>
        article.type === LoadableDataStatus.IDLE &&
        user.type === UserStatus.Authorized &&
        article.data.author.username === user.user.username
    )
  )
