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

/**
 * @export
 * @interface NewArticle
 */
export interface NewArticle {
  /**
   * @type {string}
   * @memberof NewArticle
   */
  title: string
  /**
   * @type {string}
   * @memberof NewArticle
   */
  description: string
  /**
   * @type {string}
   * @memberof NewArticle
   */
  body: string
  /**
   * @type {Array<string>}
   * @memberof NewArticle
   */
  tagList?: Array<string>
}
