import { EMPTY, merge } from 'rxjs'
import { switchMapTo, tap } from 'rxjs/operators'
import { BrowserHistory, State, To, Update } from 'history'

import { createRxState } from 'lib/store-rx-state'
import { Store } from 'lib/store'
import { ObservableOf } from 'lib/store-rx-store'

export type NavigateEventPayload =
  | To
  | {
      to: To
      state?: State
      replace?: boolean
    }

export type NavigationEvents = {
  navigate: NavigateEventPayload
}

export type NavigationSources = {
  update: Update
}

export function createNavigation(
  store: Store<Update>,
  { navigate$, update$ }: ObservableOf<NavigationEvents & NavigationSources>,
  history: BrowserHistory
) {
  return createRxState(
    store,
    merge(
      update$,
      navigate$.pipe(
        tap((place) =>
          typeof place === 'string' || !('to' in place)
            ? history.push(place)
            : (place.replace ? history.replace : history.push)(
                place.to,
                place.state
              )
        ),
        switchMapTo(EMPTY)
      )
    )
  )
}
