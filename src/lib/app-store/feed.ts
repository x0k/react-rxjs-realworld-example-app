import { combineLatest, merge } from 'rxjs'
import {
  takeUntil,
  exhaustMap,
  map,
  tap,
  mapTo,
  switchMap,
  filter,
} from 'rxjs/operators'

import {
  Article,
  ArticlesApi,
  FavoritesApi,
  MultipleArticlesResponse,
} from 'lib/conduit-client'
import {
  createRxStateFactory,
  StateOptions,
  StateSignals,
  StateHandlers,
} from 'lib/rx-store'

import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'lib/models'
import { FeedType } from 'lib/models'

import { FeedTypeStates, initialFeedTypeState } from './feed-type'

export type FeedState = ReLoadableData & MultipleArticlesResponse

export const initialFeedState: FeedState = {
  loading: false,
  errors: {},
  articles: [],
  articlesCount: -1,
}

export const feedPerPage = 10

export type FeedEvents = {
  stop: unknown
  toggleFavorite: Article
}

export type FeedSources = {
  feedType: FeedTypeStates
  feedPage: number
}

export type FeedSignals = {
  setFeedType: FeedTypeStates
}

export const createFeed = createRxStateFactory(
  (
    {
      events: { stop$, toggleFavorite$ },
      signals: { setFeedType },
      sources: { feedPage$, feedType$ },
      store,
    }: StateOptions<FeedState, FeedEvents, FeedSources> &
      StateSignals<FeedSignals>,
    api: ArticlesApi,
    favoriteApi: FavoritesApi
  ): StateHandlers<FeedState> => {
    const catchGenericAjaxError =
      createGenericAjaxErrorCatcherForReLoadableData(store)
    const knownFeedType$ = filter<FeedTypeStates>(
      (state) => state.type !== FeedType.Unknown
    )(feedType$)
    const pageAndType$ = combineLatest([feedPage$, knownFeedType$])
    return [
      merge<FeedState>(
        knownFeedType$.pipe(mapTo(initialFeedState)),
        pageAndType$.pipe(map(() => ({ ...store.state, loading: true }))),
        pageAndType$.pipe(
          switchMap(([page, feedType]) => {
            const payload = {
              ...feedType,
              limit: feedPerPage,
              offset: (page - 1) * feedPerPage,
            }
            return feedType.type === FeedType.Your
              ? api.getArticlesFeed(payload)
              : api.getArticles(payload)
          }),
          map<MultipleArticlesResponse, FeedState>((data) => ({
            ...store.state,
            ...data,
            loading: false,
            errors: {},
          })),
          catchGenericAjaxError
        ),
        toggleFavorite$.pipe(
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
      takeUntil(
        stop$.pipe(
          tap(() => {
            store.set(initialFeedState)
            setFeedType(initialFeedTypeState)
          })
        )
      ),
    ]
  }
)
