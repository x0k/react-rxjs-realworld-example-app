import { Store } from 'lib/store'

import { createGenericErrorCatcher, Errors, GenericAjaxError } from './errors'

export interface ReLoadableData {
  errors: Errors
  loading: boolean
}

export function createGenericAjaxErrorCatcherForReLoadableData<
  S extends ReLoadableData
>(
  store: Store<S>,
  handler = (state: S, error: GenericAjaxError): S => ({
    ...state,
    loading: false,
    errors: error.response?.errors ?? { error: [error.message] },
  })
) {
  return createGenericErrorCatcher((error) => handler(store.state, error))
}
