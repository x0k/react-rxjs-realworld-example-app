import {
  identity,
  merge,
  MonoTypeOperatorFunction,
  Observable,
  ReplaySubject,
} from 'rxjs'
import { multicast, refCount, tap } from 'rxjs/operators'

import { Store as StoreState } from 'lib/store'

export function createRxState<State>(
  state: StoreState<State>,
  reducer$: Observable<State>,
  enhancer: MonoTypeOperatorFunction<State> = identity
) {
  // Common "of" with lazy getState
  const initial$ = new Observable<State>((observer) => {
    observer.next(state.state)
    observer.complete()
  })
  const handlers$ = reducer$.pipe(tap(state.set))
  const state$ = merge(initial$, handlers$)
  return enhancer(state$).pipe(
    multicast(() => new ReplaySubject<State>(1)),
    refCount()
  )
}
