import { GenericErrorModel } from 'lib/conduit-client'
import { AjaxError } from 'rxjs/ajax'

export type Errors = Record<string, string[]>

export type GenericAjaxError = AjaxError<GenericErrorModel>
