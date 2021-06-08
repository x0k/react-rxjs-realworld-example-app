import { EMPTY, merge } from 'rxjs'
import { switchMapTo, tap } from 'rxjs/operators'
import { BrowserHistory, State, To, Update } from 'history'

import { createRxStateFactory, StateOptions } from 'lib/rx-store'

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

export const createNavigation = createRxStateFactory(
  (
    {
      events: { navigate$, update$ },
    }: StateOptions<Update, NavigationEvents & NavigationSources>,
    history: BrowserHistory
  ) => [
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
    ),
  ]
)
