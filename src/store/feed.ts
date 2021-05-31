import { EMPTY, merge, Observable, of, Subject } from 'rxjs'
import { takeUntil, catchError, exhaustMap, map, tap, switchMapTo } from 'rxjs/operators'

import { Article, MultipleArticlesResponse } from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { State } from 'lib/state'
import { articleApi, favoriteApi } from 'lib/api'
import { createMemoryStore } from 'lib/store'

import { GenericAjaxError } from 'models/errors'

import { Tag } from './tags'
import { ProfileUsername } from './profile'

export enum FeedType {
  Global = 'global',
  Your = 'your',
}

export type FeedTypeStates =
  | State<
      FeedType.Global,
      { tag?: Tag; author?: ProfileUsername; favorited?: ProfileUsername }
    >
  | State<FeedType.Your>

export type FeedState = MultipleArticlesResponse & {
  page: number
  loading: boolean
  error?: GenericAjaxError
  feedType: FeedTypeStates
}

export const feedSetFeedType = new Subject<FeedTypeStates>()

export const feedSetPage = new Subject<number>()

export const feedLoad = new Subject()

export const feedCleanup = new Subject()

export const feedToggleFavorite = new Subject<Article>()

const initialState: FeedState = {
  loading: false,
  articles: [],
  articlesCount: -1,
  page: 1,
  feedType: { type: FeedType.Global },
}

export const feedPerPage = 10

const store = createMemoryStore(initialState)

const catchGenericAjaxError = catchError<FeedState, Observable<FeedState>>(
  (error: GenericAjaxError, caught) =>
    merge(caught, of<FeedState>({ ...store.state, error, loading: false }))
)

export const feed$ = createRxState<FeedState>(
  store,
  merge<FeedState>(
    feedSetFeedType.pipe(map((feedType) => ({ ...initialState, feedType }))),
    feedSetPage.pipe(map((page) => ({ ...store.state, page }))),
    merge(feedSetFeedType, feedSetPage).pipe(
      tap(() => feedLoad.next()),
      switchMapTo(EMPTY)
    ),
    feedLoad.pipe(map(() => ({ ...store.state, loading: true }))),
    feedLoad.pipe(
      map(() => store.state),
      exhaustMap(({ feedType, page }) => {
        const payload = {
          ...feedType,
          limit: feedPerPage,
          offset: (page - 1) * feedPerPage,
        }
        return feedType.type === FeedType.Your
          ? articleApi.getArticlesFeed(payload)
          : articleApi.getArticles(payload)
      }),
      map<MultipleArticlesResponse, FeedState>((data) => ({
        ...store.state,
        ...data,
        loading: false,
        error: undefined,
      })),
      catchGenericAjaxError
    ),
    feedSetPage.pipe(map((page) => ({ ...store.state, page }))),
    feedToggleFavorite.pipe(
      exhaustMap(({ favorited, slug }) =>
        favorited
          ? favoriteApi.deleteArticleFavorite({ slug })
          : favoriteApi.createArticleFavorite({ slug })
      ),
      map(({ article }) => {
        const { articles, ...rest } = store.state
        return {
          ...rest,
          articles: articles.map((a) =>
            a.slug === article.slug ? article : a
          ),
        }
      }),
      catchGenericAjaxError
    )
  ),
  takeUntil(feedCleanup)
)
