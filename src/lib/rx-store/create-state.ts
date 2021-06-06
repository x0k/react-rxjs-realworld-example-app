import { identity, merge, Observable, ReplaySubject } from 'rxjs'
import { multicast, refCount, tap } from 'rxjs/operators'

import { StateHandlers, StateOptions } from './model'

export function createRxStateFactory<
  State,
  Events,
  Options extends StateOptions<State, Events>,
  Dependencies extends ReadonlyArray<any> = []
>(
  createHandlers: (
    options: Options,
    ...rest: Dependencies
  ) => StateHandlers<State>
): (options: Options, ...rest: Dependencies) => Observable<State> {
  return (options, ...rest) => {
    const [reducer$, enhancer = identity] = createHandlers(options, ...rest)
    const { store } = options
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
