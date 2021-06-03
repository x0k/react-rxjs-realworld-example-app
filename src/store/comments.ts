import { merge, Subject } from 'rxjs'
import { exhaustMap, map, switchMap, takeUntil } from 'rxjs/operators'

import { createRxState } from 'lib/store-rx-state'
import { Comment } from 'lib/conduit-client'
import { commentsApi } from 'lib/api'
import { injectStore } from 'lib/store-rx-inject'
import { createMemoryStore } from 'lib/store'

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

const initialState: CommentsState = {
  loading: false,
  errors: {},
  comment: '',
  comments: [],
  slug: '',
}

export const commentsLoad = new Subject<ArticleSlug>()

export const commentsCleanup = new Subject()

export const commentsChangeComment = new Subject<string>()

export const commentsPostComment = new Subject()

export const commentsDeleteComment = new Subject<Comment>()

const store = createMemoryStore<CommentsState>(initialState)

const catchGenericAjaxError =
  createGenericAjaxErrorCatcherForReLoadableData(store)

export const comments$ = createRxState(
  store,
  merge(
    merge(commentsLoad, commentsPostComment, commentsDeleteComment).pipe(
      map(() => ({ ...store.state, loading: true }))
    ),
    commentsLoad.pipe(
      switchMap((slug) =>
        commentsApi.getArticleComments({ slug }).pipe(
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
    commentsChangeComment.pipe(map((comment) => ({ ...store.state, comment }))),
    commentsPostComment.pipe(
      map(() => store.state),
      exhaustMap(({ slug, comment }) =>
        commentsApi.createArticleComment({
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
    commentsDeleteComment.pipe(
      injectStore(store),
      exhaustMap(([{ id }, { slug }]) =>
        commentsApi.deleteArticleComment({ slug, id }).pipe(
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
  takeUntil(commentsCleanup)
)
