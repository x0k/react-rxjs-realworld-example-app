import { merge } from 'rxjs'
import { exhaustMap, map, switchMap, takeUntil } from 'rxjs/operators'

import { createRxState } from 'lib/store-rx-state'
import { Comment, CommentsApi } from 'lib/conduit-client'
import { injectStore } from 'lib/store-rx-inject'
import { Store } from 'lib/store'
import { ObservableOf } from 'lib/store-rx-store'

import { ArticleSlug } from 'models/article'
import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'models/re-loadable-data'

export type CommentsState = ReLoadableData & {
  comment: string
  comments: Comment[]
  slug: ArticleSlug
}

export const initialCommentsState: CommentsState = {
  loading: false,
  errors: {},
  comment: '',
  comments: [],
  slug: '',
}

export type CommentsEvents = ObservableOf<{
  load: ArticleSlug
  stop: unknown
  changeComment: string
  postComment: unknown
  deleteComment: Comment
}>

export function createComments(
  store: Store<CommentsState>,
  {
    changeComment$,
    deleteComment$,
    load$,
    postComment$,
    stop$,
  }: CommentsEvents,
  api: CommentsApi
) {
  const catchGenericAjaxError =
    createGenericAjaxErrorCatcherForReLoadableData(store)

  return createRxState(
    store,
    merge(
      merge(load$, postComment$, deleteComment$).pipe(
        map(() => ({ ...store.state, loading: true }))
      ),
      load$.pipe(
        switchMap((slug) =>
          api.getArticleComments({ slug }).pipe(
            map(({ comments }) => ({
              ...store.state,
              slug,
              comments,
              errors: {},
              loading: false,
            }))
          )
        ),
        catchGenericAjaxError
      ),
      changeComment$.pipe(map((comment) => ({ ...store.state, comment }))),
      postComment$.pipe(
        map(() => store.state),
        exhaustMap(({ slug, comment }) =>
          api.createArticleComment({
            slug,
            comment: { comment: { body: comment } },
          })
        ),
        map(({ comment }) => {
          const state = store.state
          return {
            ...state,
            comment: '',
            comments: [comment, ...state.comments],
            loading: false,
            errors: {},
          }
        }),
        catchGenericAjaxError
      ),
      deleteComment$.pipe(
        injectStore(store),
        exhaustMap(([{ id }, { slug }]) =>
          api.deleteArticleComment({ slug, id }).pipe(
            map(() => {
              const state = store.state
              return {
                ...state,
                comments: state.comments.filter((c) => c.id !== id),
                loading: false,
                errors: {},
              }
            })
          )
        ),
        catchGenericAjaxError
      )
    ),
    takeUntil(stop$)
  )
}
