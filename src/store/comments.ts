import { merge, Observable, of, Subject } from 'rxjs'
import { catchError, exhaustMap, map, takeUntil } from 'rxjs/operators'

import { createRxState } from 'lib/store-rx-state'
import { Comment } from 'lib/conduit-client'
import { commentsApi } from 'lib/api'
import { injectStore } from 'lib/store-rx-inject'
import { createMemoryStore } from 'lib/store'

import { Errors, GenericAjaxError } from 'models/errors'
import { ArticleSlug } from 'models/article'

export interface CommentsState {
  errors: Errors
  comment: string
  comments: Comment[]
  slug: ArticleSlug
}

const initialState: CommentsState = {
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

const catchGenericAjaxError = catchError<
  CommentsState,
  Observable<CommentsState>
>((error: GenericAjaxError, caught) =>
  merge(
    caught,
    of<CommentsState>({
      ...store.state,
      errors: error.response?.errors ?? { error: [error.message] },
    })
  )
)

export const comments$ = createRxState(
  store,
  merge(
    commentsLoad.pipe(
      exhaustMap((slug) =>
        commentsApi.getArticleComments({ slug }).pipe(
          map(({ comments }) => ({
            ...store.state,
            slug,
            comments,
            errors: {},
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
            }
          })
        )
      ),
      catchGenericAjaxError
    )
  ),
  takeUntil(commentsCleanup)
)
