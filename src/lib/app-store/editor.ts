import { EMPTY, merge, Observable } from 'rxjs'
import {
  exhaustMap,
  filter,
  map,
  tap,
  takeUntil,
  switchMapTo,
  switchMap,
} from 'rxjs/operators'

import {
  ArticlesApi,
  NewArticle,
  SingleArticleResponse,
  UpdateArticle,
} from 'lib/conduit-client'
import { partiallyFoldState, State } from 'lib/state'
import { ChangeFieldEventPayload } from 'lib/event'
import { isTruly } from 'lib/types'
import {
  createRxStateFactory,
  StateOptions,
  StateSignals,
  StateHandlers,
} from 'lib/rx-store'
import {
  getArticlePath,
  ArticleTag,
  ArticleSlug,
  createGenericAjaxErrorCatcherForReLoadableData,
  ReLoadableData,
} from 'lib/models'

import { NavigateEventPayload } from './navigation'

export enum EditorStatus {
  Create = 'create',
  Update = 'update',
}

export type EditorState = ReLoadableData & {
  tag: ArticleTag
} & (
    | State<EditorStatus.Create, NewArticle>
    | State<EditorStatus.Update, UpdateArticle & { slug: ArticleSlug }>
  )

export type EditorChangeFieldEventPayload = ChangeFieldEventPayload<
  NewArticle & { tag: ArticleTag }
>

export const initialEditorState: EditorState = {
  type: EditorStatus.Create,
  body: '',
  description: '',
  title: '',
  tag: '',
  tagList: [],
  loading: false,
  errors: {},
}

export type EditorEvents = {
  changeField: EditorChangeFieldEventPayload
  addTag: unknown
  removeTag: ArticleTag
  loadArticle: ArticleSlug | undefined
  stop: unknown
  publish: unknown
}

export type EditorSignals = {
  navigate: NavigateEventPayload
}

export const createEditor = createRxStateFactory(
  (
    {
      events: {
        addTag$,
        changeField$,
        loadArticle$,
        publish$,
        removeTag$,
        stop$,
      },
      signals: { navigate },
      store,
    }: StateOptions<EditorState, EditorEvents> & StateSignals<EditorSignals>,
    api: ArticlesApi
  ): StateHandlers<EditorState> => {
    const catchGenericAjaxError =
      createGenericAjaxErrorCatcherForReLoadableData(store)
    const handleEditorPublish = partiallyFoldState<
      EditorStatus,
      EditorStatus.Create | EditorStatus.Update,
      EditorState,
      Observable<SingleArticleResponse>
    >(
      {
        [EditorStatus.Create]: (state) =>
          api.createArticle({ article: { article: state } }),
        [EditorStatus.Update]: (state) =>
          api.updateArticle({
            slug: state.slug,
            article: { article: state },
          }),
      },
      () => EMPTY
    )
    return [
      merge<EditorState>(
        changeField$.pipe(
          map(({ field, value }) => ({ ...store.state, [field]: value }))
        ),
        addTag$.pipe(
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
        removeTag$.pipe(
          map((tag) => {
            const state = store.state
            const { tagList } = state
            return {
              ...state,
              tagList: tagList && tagList.filter((t) => t !== tag),
            }
          })
        ),
        loadArticle$.pipe(
          filter(isTruly),
          map(() => ({ ...store.state, loading: true }))
        ),
        loadArticle$.pipe(
          filter(isTruly),
          exhaustMap((slug) => api.getArticle({ slug })),
          map<SingleArticleResponse, EditorState>(({ article }) => ({
            ...article,
            type: EditorStatus.Update,
            loading: false,
            errors: {},
            tag: '',
          })),
          catchGenericAjaxError
        ),
        publish$.pipe(map(() => ({ ...store.state, loading: true }))),
        publish$.pipe(
          map(() => store.state),
          switchMap(handleEditorPublish),
          tap(({ article: { slug } }) => navigate(getArticlePath(slug))),
          switchMapTo(EMPTY),
          catchGenericAjaxError
        )
      ),
      takeUntil(stop$.pipe(tap(() => store.set(initialEditorState)))),
    ]
  }
)
