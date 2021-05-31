import { EMPTY, merge, Observable, Subject, Subscription } from 'rxjs'
import { switchMapTo, tap } from 'rxjs/operators'
import { State, To, Update } from 'history'

import { history } from 'lib/history'
import { createRxState } from 'lib/store-rx-state'
import { createMemoryStore } from 'lib/store'

export type NavigationPushEventPayload =
  | To
  | {
      to: To
      state?: State
    }

export const navigationPush = new Subject<NavigationPushEventPayload>()

const store = createMemoryStore<Update>(history)

export const navigation$ = createRxState(
  store,
  merge(
    new Observable(
      (observer) =>
        new Subscription(history.listen((state) => observer.next(state)))
    ),
    navigationPush.pipe(
      tap((place) =>
        typeof place === 'string' || !('to' in place)
          ? history.push(place)
          : history.push(place.to, place.state)
      ),
      switchMapTo(EMPTY)
    )
  )
)
