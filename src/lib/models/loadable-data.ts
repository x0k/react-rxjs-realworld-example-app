import { State } from 'lib/state'

import { createGenericErrorCatcher, GenericAjaxError } from './errors'

export enum LoadableDataStatus {
  Init = 'init',
  Loading = 'loading',
  IDLE = 'idle',
  Error = 'Error',
}

export type LoadableDataStates<T, E> =
  | State<LoadableDataStatus.Init>
  | State<LoadableDataStatus.Loading>
  | State<LoadableDataStatus.IDLE, { data: T }>
  | State<LoadableDataStatus.Error, { error: E }>

function genericAjaxErrorHandler(
  error: GenericAjaxError
): LoadableDataStates<any, GenericAjaxError> {
  return { type: LoadableDataStatus.Error, error }
}

export const catchGenericAjaxErrorForLoadableData = createGenericErrorCatcher(
  genericAjaxErrorHandler
)
