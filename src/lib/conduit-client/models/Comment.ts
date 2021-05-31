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

import { Profile } from './'

/**
 * @export
 * @interface Comment
 */
export interface Comment {
  /**
   * @type {number}
   * @memberof Comment
   */
  id: number
  /**
   * @type {string}
   * @memberof Comment
   */
  createdAt: string
  /**
   * @type {string}
   * @memberof Comment
   */
  updatedAt: string
  /**
   * @type {string}
   * @memberof Comment
   */
  body: string
  /**
   * @type {Profile}
   * @memberof Comment
   */
  author: Profile
}