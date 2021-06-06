import { merge } from 'rxjs'
import { exhaustMap, map, switchMap, takeUntil } from 'rxjs/operators'

import { Comment, CommentsApi } from 'lib/conduit-client'
import {
  injectStore,
  createRxStateFactory,
  StateOptions,
  StateHandlers,
} from 'lib/rx-store'

import { ArticleSlug } from 'lib/models'
import {
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'lib/models'

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

export const createComments = createRxStateFactory(
  (
    {
      store,
      events: { changeComment$, deleteComment$, load$, postComment$, stop$ },
    }: StateOptions<CommentsState, CommentsEvents>,
    api: CommentsApi
  ): StateHandlers<CommentsState> => {
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
