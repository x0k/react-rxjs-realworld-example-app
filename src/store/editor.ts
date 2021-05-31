import { EMPTY, merge, Observable, of, Subject } from 'rxjs'
import {
  catchError,
  exhaustMap,
  filter,
  map,
  tap,
  takeUntil,
  switchMapTo,
} from 'rxjs/operators'

import { articleApi } from 'lib/api'
import {
  NewArticle,
  SingleArticleResponse,
  UpdateArticle,
} from 'lib/conduit-client'
import { createRxState } from 'lib/store-rx-state'
import { partiallyFoldState, State } from 'lib/state'
import { ChangeFieldEventPayload } from 'lib/event'
import { isTruly } from 'lib/types'
import { createMemoryStore } from 'lib/store'

import { getArticlePath } from 'models/path'
import { Errors, GenericAjaxError } from 'models/errors'
import { ArticleTag, ArticleSlug } from 'models/article'

import { navigationPush } from './navigation'

export enum EditorStatus {
  Create = 'create',
  Update = 'update',
}

export type EditorState = {
  tag: ArticleTag
  loading: boolean
  errors: Errors
} & (
  | State<EditorStatus.Create, NewArticle>
  | State<EditorStatus.Update, UpdateArticle & { slug: ArticleSlug }>
)

export type EditorChangeFieldEventPayload = ChangeFieldEventPayload<
  NewArticle & { tag: ArticleTag }
>

export const editorChangeField = new Subject<EditorChangeFieldEventPayload>()

export const editorAddTag = new Subject()

export const editorRemoveTag = new Subject<ArticleTag>()

export const editorLoadArticle = new Subject<ArticleSlug | undefined>()

export const editorCleanup = new Subject()

export const editorPublishArticle = new Subject()

const initialState: EditorState = {
  type: EditorStatus.Create,
  body: '',
  description: '',
  title: '',
  tag: '',
  tagList: [],
  loading: false,
  errors: {},
}

const handleEditorPublish = partiallyFoldState<
  EditorStatus,
  EditorStatus.Create | EditorStatus.Update,
  EditorState,
  Observable<SingleArticleResponse>
>(
  {
    [EditorStatus.Create]: (state) =>
      articleApi.createArticle({ article: { article: state } }),
    [EditorStatus.Update]: (state) =>
      articleApi.updateArticle({
        slug: state.slug,
        article: { article: state },
      }),
  },
  () => EMPTY
)

const store = createMemoryStore<EditorState>(initialState)

const catchGenericAjaxError = catchError<EditorState, Observable<EditorState>>(
  (error: GenericAjaxError, caught) =>
    merge(
      caught,
      of({
        ...store.state,
        loading: false,
        errors: error.response?.errors ?? { error: [error.message] },
      })
    )
)

export const editor$ = createRxState(
  store,
  merge<EditorState>(
    editorChangeField.pipe(
      map(({ field, value }) => ({ ...store.state, [field]: value }))
    ),
    editorAddTag.pipe(
      map(() => {
        const { tag, tagList = [] } = store.state
        const tags = tagList.includes(tag)
          ? tagList.filter((t) => t !== tag)
          : tagList
        return {
          ...store.state,
          tag: '',
          tagList: tags.concat(tag),
        }
      })
    ),
    editorRemoveTag.pipe(
      map((tag) => {
        const state = store.state
        const { tagList } = state
        return {
          ...state,
          tagList: tagList && tagList.filter((t) => t !== tag),
        }
      })
    ),
    editorLoadArticle.pipe(
      filter(isTruly),
      map(() => ({ ...store.state, loading: true }))
    ),
    editorLoadArticle.pipe(
      filter(isTruly),
      exhaustMap((slug) => articleApi.getArticle({ slug })),
      map<SingleArticleResponse, EditorState>(({ article }) => ({
        ...article,
        type: EditorStatus.Update,
        loading: false,
        errors: {},
        tag: '',
      })),
      catchGenericAjaxError
    ),
    editorPublishArticle.pipe(map(() => ({ ...store.state, loading: true }))),
    editorPublishArticle.pipe(
      map(() => store.state),
      exhaustMap(handleEditorPublish),
      tap(({ article: { slug } }) => navigationPush.next(getArticlePath(slug))),
      switchMapTo(EMPTY),
      catchGenericAjaxError
    )
  ),
  takeUntil(editorCleanup.pipe(tap(() => store.set(initialState))))
)
