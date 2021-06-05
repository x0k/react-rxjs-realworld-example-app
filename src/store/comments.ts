import { merge } from 'rxjs'
import { exhaustMap, map, switchMap, takeUntil } from 'rxjs/operators'

import { Comment, CommentsApi } from 'lib/conduit-client'
import { injectStore, createRxStateFactory } from 'lib/rx-store'

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

export type CommentsEvents = {
  load: ArticleSlug
  stop: unknown
  changeComment: string
  postComment: unknown
  deleteComment: Comment
}

export const createComments = createRxStateFactory<
  CommentsState,
  CommentsEvents,
  [CommentsApi]
>(
  (
    store,
    { changeComment$, deleteComment$, load$, postComment$, stop$ },
    api
  ) => {
    const catchGenericAjaxError =
      createGenericAjaxErrorCatcherForReLoadableData(store)
    return [
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
      takeUntil(stop$),
    ]
  }
)
