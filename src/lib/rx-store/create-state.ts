import {
  identity,
  merge,
  MonoTypeOperatorFunction,
  Observable,
  ReplaySubject,
} from 'rxjs'
import { multicast, refCount, tap } from 'rxjs/operators'

import { Store as StoreState } from 'lib/store'

import { ObservableOf } from './create'

export function createRxStateFactory<
  State,
  Events,
  Args extends ReadonlyArray<any> = []
>(
  createState: (
    store: StoreState<State>,
    events: ObservableOf<Events>,
    ...rest: Args
  ) =>
    | [Observable<State>]
    | [Observable<State>, MonoTypeOperatorFunction<State>]
) {
  return (
    store: StoreState<State>,
    events: ObservableOf<Events>,
    ...rest: Args
  ) => {
    const [reducer$, enhancer = identity] = createState(store, events, ...rest)
    const initial$ = new Observable<State>((observer) => {
      observer.next(store.state)
      observer.complete()
    })
    const handlers$ = reducer$.pipe(tap(store.set))
    const state$ = merge(initial$, handlers$)
    return enhancer(state$).pipe(
      multicast(() => new ReplaySubject<State>(1)),
      refCount()
    )
  }
}
