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
import { BaseAPI, OperationOpts, RawAjaxResponse } from '../runtime'
import { GenericErrorModel, TagsResponse } from '../models'

/**
 * no description
 */
export class DefaultApi extends BaseAPI {
  /**
   * Get tags. Auth not required
   * Get tags
   */
  tagsGet(): Observable<TagsResponse>
  tagsGet(opts?: OperationOpts): Observable<RawAjaxResponse<TagsResponse>>
  tagsGet(
    opts?: OperationOpts
  ): Observable<TagsResponse | RawAjaxResponse<TagsResponse>> {
    return this.request<TagsResponse>(
      {
        url: '/tags',
        method: 'GET',
      },
      opts?.responseOpts
    )
  }
}
