// tslint:disable
/**
 * Conduit API
 * Conduit API
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Observable } from 'rxjs'
import {
  BaseAPI,
  HttpHeaders,
  throwIfNullOrUndefined,
  encodeURI,
  OperationOpts,
  RawAjaxResponse,
} from '../runtime'
import {
  GenericErrorModel,
  MultipleCommentsResponse,
  NewCommentRequest,
  SingleCommentResponse,
} from '../models'

export interface CreateArticleCommentRequest {
  slug: string
  comment: NewCommentRequest
}

export interface DeleteArticleCommentRequest {
  slug: string
  id: number
}

export interface GetArticleCommentsRequest {
  slug: string
}

/**
 * no description
 */
export class CommentsApi extends BaseAPI {
  /**
   * Create a comment for an article. Auth is required
   * Create a comment for an article
   */
  createArticleComment({
    slug,
    comment,
  }: CreateArticleCommentRequest): Observable<SingleCommentResponse>
  createArticleComment(
    { slug, comment }: CreateArticleCommentRequest,
    opts?: OperationOpts
  ): Observable<RawAjaxResponse<SingleCommentResponse>>
  createArticleComment(
    { slug, comment }: CreateArticleCommentRequest,
    opts?: OperationOpts
  ): Observable<
    SingleCommentResponse | RawAjaxResponse<SingleCommentResponse>
  > {
    throwIfNullOrUndefined(slug, 'slug', 'createArticleComment')
    throwIfNullOrUndefined(comment, 'comment', 'createArticleComment')

    const headers: HttpHeaders = {
      'Content-Type': 'application/json',
      ...(this.configuration.apiKey && {
        Authorization: this.configuration.apiKey('Authorization'),
      }), // Token authentication
    }

    return this.request<SingleCommentResponse>(
      {
        url: '/articles/{slug}/comments'.replace('{slug}', encodeURI(slug)),
        method: 'POST',
        headers,
        body: comment,
      },
      opts?.responseOpts
    )
  }

  /**
   * Delete a comment for an article. Auth is required
   * Delete a comment for an article
   */
  deleteArticleComment({
    slug,
    id,
  }: DeleteArticleCommentRequest): Observable<void>
  deleteArticleComment(
    { slug, id }: DeleteArticleCommentRequest,
    opts?: OperationOpts
  ): Observable<void | RawAjaxResponse<void>>
  deleteArticleComment(
    { slug, id }: DeleteArticleCommentRequest,
    opts?: OperationOpts
  ): Observable<void | RawAjaxResponse<void>> {
    throwIfNullOrUndefined(slug, 'slug', 'deleteArticleComment')
    throwIfNullOrUndefined(id, 'id', 'deleteArticleComment')

    const headers: HttpHeaders = {
      ...(this.configuration.apiKey && {
        Authorization: this.configuration.apiKey('Authorization'),
      }), // Token authentication
    }

    return this.request<void>(
      {
        url: '/articles/{slug}/comments/{id}'
          .replace('{slug}', encodeURI(slug))
          .replace('{id}', encodeURI(id)),
        method: 'DELETE',
        headers,
      },
      opts?.responseOpts
    )
  }

  /**
   * Get the comments for an article. Auth is optional
   * Get comments for an article
   */
  getArticleComments({
    slug,
  }: GetArticleCommentsRequest): Observable<MultipleCommentsResponse>
  getArticleComments(
    { slug }: GetArticleCommentsRequest,
    opts?: OperationOpts
  ): Observable<RawAjaxResponse<MultipleCommentsResponse>>
  getArticleComments(
    { slug }: GetArticleCommentsRequest,
    opts?: OperationOpts
  ): Observable<
    MultipleCommentsResponse | RawAjaxResponse<MultipleCommentsResponse>
  > {
    throwIfNullOrUndefined(slug, 'slug', 'getArticleComments')

    return this.request<MultipleCommentsResponse>(
      {
        url: '/articles/{slug}/comments'.replace('{slug}', encodeURI(slug)),
        method: 'GET',
      },
      opts?.responseOpts
    )
  }
}
