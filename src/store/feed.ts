import { combineLatest, merge, Subject } from 'rxjs'
import {
  takeUntil,
  exhaustMap,
  map,
  tap,
  mapTo,
  switchMap,
} from 'rxjs/operators'

import { Article, MultipleArticlesResponse } from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { articleApi, favoriteApi } from 'lib/api'
import { createMemoryStore } from 'lib/store'

import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'models/re-loadable-data'

import { feedPage$ } from './feed-page'
import { FeedType, feedType$ } from './feed-type'

export const feedCleanup = new Subject()

export const feedToggleFavorite = new Subject<Article>()

export type FeedState = ReLoadableData & MultipleArticlesResponse

const initialState: FeedState = {
  loading: false,
  errors: {},
  articles: [],
  articlesCount: -1,
}

export const feedPerPage = 10

const store = createMemoryStore(initialState)

const catchGenericAjaxError =
  createGenericAjaxErrorCatcherForReLoadableData(store)

const pageAndType$ = combineLatest([feedPage$, feedType$])

export const feed$ = createRxState<FeedState>(
  store,
  merge<FeedState>(
    feedType$.pipe(mapTo(initialState)),
    pageAndType$.pipe(map(() => ({ ...store.state, loading: true }))),
    pageAndType$.pipe(
      switchMap(([page, feedType]) => {
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
        errors: {},
      })),
      catchGenericAjaxError
    ),
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
  takeUntil(feedCleanup.pipe(tap(() => store.set(initialState))))
)
