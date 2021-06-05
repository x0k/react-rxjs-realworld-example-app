import { Observable, of, OperatorFunction } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { Store } from 'lib/store'

export function injectStore<T, State>(
  store: Store<State>
): OperatorFunction<T, [T, State]>

export function injectStore<T, State, R>(
  store: Store<State>,
  enhancer: OperatorFunction<State, R>
): OperatorFunction<T, [T, R]>

export function injectStore<T, State, R>(
  store: Store<State>,
  enhancer?: OperatorFunction<State, R>
) {
  return enhancer
    ? switchMap<T, Observable<[T, R]>>((data) =>
        map<R, [T, R]>((value) => [data, value])(enhancer(of(store.state)))
      )
    : map<T, [T, State]>((data) => [data, store.state])
}
