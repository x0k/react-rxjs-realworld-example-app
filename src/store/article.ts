import { combineLatest, merge, Observable, of, Subject } from 'rxjs'
import {
  catchError,
  exhaustMap,
  filter,
  map,
  mapTo,
  takeUntil,
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

import { DataStates, DataStatus } from 'models/data'
import { GenericAjaxError } from 'models/errors'
import { ArticleSlug } from 'models/article'

import { user$, UserStatus } from './user'

export type ArticleStates = DataStates<Article, GenericAjaxError>

export const articleLoad = new Subject<ArticleSlug>()

export const articleCleanup = new Subject()

export const articleDelete = new Subject()

export const articleToggleFollow = new Subject()

export const articleToggleFavorite = new Subject()

const singleArticleResponseToState = map<SingleArticleResponse, ArticleStates>(
  ({ article }) => ({
    type: DataStatus.IDLE,
    data: article,
  })
)

const catchGenericAjaxError = catchError<
  ArticleStates,
  Observable<ArticleStates>
>((error: GenericAjaxError, caught) =>
  merge(caught, of<ArticleStates>({ type: DataStatus.Error, error }))
)

const store = createMemoryStore<ArticleStates>({ type: DataStatus.Init })

export const article$ = createRxState<ArticleStates>(
  store,
  merge(
    articleLoad.pipe(mapTo({ type: DataStatus.Loading })),
    articleLoad.pipe(
      exhaustMap((slug) => articleApi.getArticle({ slug })),
      singleArticleResponseToState,
      catchGenericAjaxError
    ),
    articleDelete.pipe(
      map(() => store.state),
      filter(isSpecificState(DataStatus.IDLE)),
      exhaustMap(({ data }) => articleApi.deleteArticle(data)),
      mapTo<void, ArticleStates>({ type: DataStatus.Init }),
      catchGenericAjaxError
    ),
    articleToggleFollow.pipe(
      map(() => store.state),
      filter(isSpecificState(DataStatus.IDLE)),
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
            type: DataStatus.IDLE,
            data: { ...data, author: profile },
          }))
        )
      }),
      catchGenericAjaxError
    ),
    articleToggleFavorite.pipe(
      map(() => store.state),
      filter(isSpecificState(DataStatus.IDLE)),
      exhaustMap(({ data: { favorited, slug } }) => {
        return favorited
          ? favoriteApi.deleteArticleFavorite({ slug })
          : favoriteApi.createArticleFavorite({ slug })
      }),
      singleArticleResponseToState,
      catchGenericAjaxError
    )
  ),
  takeUntil(articleCleanup)
)

export const isAuthor$ = combineLatest([article$, user$]).pipe(
  map(
    ([article, user]) =>
      article.type === DataStatus.IDLE &&
      user.type === UserStatus.Authorized &&
      article.data.author.username === user.user.username
  )
)
