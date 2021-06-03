import { combineLatest, merge, Subject } from 'rxjs'
import {
  exhaustMap,
  filter,
  map,
  mapTo,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators'

import { articleApi, favoriteApi, profileApi } from 'lib/api'
import {
  Article,
  ProfileResponse,
  SingleArticleResponse,
} from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { isSpecificState } from 'lib/state'
import { createMemoryStore } from 'lib/store'

import {
  catchGenericAjaxErrorForLoadableData,
  LoadableDataStates,
  LoadableDataStatus,
} from 'models/loadable-data'
import { GenericAjaxError } from 'models/errors'
import { ArticleSlug } from 'models/article'

import { user$, UserStatus } from './user'

export type ArticleStates = LoadableDataStates<Article, GenericAjaxError>

export const articleLoad = new Subject<ArticleSlug>()

export const articleCleanup = new Subject()

export const articleDelete = new Subject()

export const articleToggleFollow = new Subject()

export const articleToggleFavorite = new Subject()

const singleArticleResponseToState = map<SingleArticleResponse, ArticleStates>(
  ({ article }) => ({
    type: LoadableDataStatus.IDLE,
    data: article,
  })
)

const initialState: ArticleStates = {
  type: LoadableDataStatus.Init,
}

const store = createMemoryStore<ArticleStates>(initialState)

export const article$ = createRxState<ArticleStates>(
  store,
  merge(
    articleLoad.pipe(mapTo({ type: LoadableDataStatus.Loading })),
    articleLoad.pipe(
      switchMap((slug) => articleApi.getArticle({ slug })),
      singleArticleResponseToState,
      catchGenericAjaxErrorForLoadableData
    ),
    articleDelete.pipe(
      map(() => store.state),
      filter(isSpecificState(LoadableDataStatus.IDLE)),
      exhaustMap(({ data }) => articleApi.deleteArticle(data)),
      mapTo<void, ArticleStates>({ type: LoadableDataStatus.Init }),
      catchGenericAjaxErrorForLoadableData
    ),
    articleToggleFollow.pipe(
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
    articleToggleFavorite.pipe(
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
  takeUntil(articleCleanup.pipe(tap(() => store.set(initialState))))
)

export const isAuthor$ = combineLatest([article$, user$]).pipe(
  map(
    ([article, user]) =>
      article.type === LoadableDataStatus.IDLE &&
      user.type === UserStatus.Authorized &&
      article.data.author.username === user.user.username
  )
)
