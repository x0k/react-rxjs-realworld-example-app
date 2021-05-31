import { merge, Observable, of } from 'rxjs'
import { AjaxError } from 'rxjs/ajax'

import { GenericErrorModel } from 'lib/conduit-client'
import { catchError } from 'rxjs/operators'

export type Errors = Record<string, string[]>

export type GenericAjaxError = AjaxError<GenericErrorModel>

export function createGenericErrorCatcher<T>(
  handler: (error: GenericAjaxError) => T
) {
  return catchError<T, Observable<T>>((error: GenericAjaxError, caught) =>
    merge(caught, of(handler(error)))
  )
}
