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
  OperationOpts,
  RawAjaxResponse,
} from '../runtime'
import {
  GenericErrorModel,
  LoginUserRequest,
  NewUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../models'

export interface CreateUserRequest {
  body: NewUserRequest
}

export interface LoginRequest {
  body: LoginUserRequest
}

export interface UpdateCurrentUserRequest {
  body: UpdateUserRequest
}

/**
 * no description
 */
export class UserAndAuthenticationApi extends BaseAPI {
  /**
   * Register a new user
   * Register a new user
   */
  createUser({ body }: CreateUserRequest): Observable<UserResponse>
  createUser(
    { body }: CreateUserRequest,
    opts?: OperationOpts
  ): Observable<RawAjaxResponse<UserResponse>>
  createUser(
    { body }: CreateUserRequest,
    opts?: OperationOpts
  ): Observable<UserResponse | RawAjaxResponse<UserResponse>> {
    throwIfNullOrUndefined(body, 'body', 'createUser')

    const headers: HttpHeaders = {
      'Content-Type': 'application/json',
    }

    return this.request<UserResponse>(
      {
        url: '/users',
        method: 'POST',
        headers,
        body: body,
      },
      opts?.responseOpts
    )
  }

  /**
   * Gets the currently logged-in user
   * Get current user
   */
  getCurrentUser(): Observable<UserResponse>
  getCurrentUser(
    opts?: OperationOpts
  ): Observable<RawAjaxResponse<UserResponse>>
  getCurrentUser(
    opts?: OperationOpts
  ): Observable<UserResponse | RawAjaxResponse<UserResponse>> {
    const headers: HttpHeaders = {
      ...(this.configuration.apiKey && {
        Authorization: this.configuration.apiKey('Authorization'),
      }), // Token authentication
    }

    return this.request<UserResponse>(
      {
        url: '/user',
        method: 'GET',
        headers,
      },
      opts?.responseOpts
    )
  }

  /**
   * Login for existing user
   * Existing user login
   */
  login({ body }: LoginRequest): Observable<UserResponse>
  login(
    { body }: LoginRequest,
    opts?: OperationOpts
  ): Observable<RawAjaxResponse<UserResponse>>
  login(
    { body }: LoginRequest,
    opts?: OperationOpts
  ): Observable<UserResponse | RawAjaxResponse<UserResponse>> {
    throwIfNullOrUndefined(body, 'body', 'login')

    const headers: HttpHeaders = {
      'Content-Type': 'application/json',
    }

    return this.request<UserResponse>(
      {
        url: '/users/login',
        method: 'POST',
        headers,
        body: body,
      },
      opts?.responseOpts
    )
  }

  /**
   * Updated user information for current user
   * Update current user
   */
  updateCurrentUser({
    body,
  }: UpdateCurrentUserRequest): Observable<UserResponse>
  updateCurrentUser(
    { body }: UpdateCurrentUserRequest,
    opts?: OperationOpts
  ): Observable<RawAjaxResponse<UserResponse>>
  updateCurrentUser(
    { body }: UpdateCurrentUserRequest,
    opts?: OperationOpts
  ): Observable<UserResponse | RawAjaxResponse<UserResponse>> {
    throwIfNullOrUndefined(body, 'body', 'updateCurrentUser')

    const headers: HttpHeaders = {
      'Content-Type': 'application/json',
      ...(this.configuration.apiKey && {
        Authorization: this.configuration.apiKey('Authorization'),
      }), // Token authentication
    }

    return this.request<UserResponse>(
      {
        url: '/user',
        method: 'PUT',
        headers,
        body: body,
      },
      opts?.responseOpts
    )
  }
}