import { Store } from 'lib/store'
import { MonoTypeOperatorFunction, Observable, Subject } from 'rxjs'

export type ObservableOf<T> = {
  [K in keyof T as `${K & string}$`]: Observable<T[K]>
}

export type SubjectsOf<T> = {
  [K in keyof T as `${K & string}$`]: Subject<T[K]>
}

export type StateOptions<State, Events, Signals = void> = {
  store: Store<State>
  events: ObservableOf<Events>
} & (Signals extends {}
  ? {
      signals: SubjectsOf<Signals>
    }
  : {})

export type StateHandlers<State> =
  | [Observable<State>]
  | [Observable<State>, MonoTypeOperatorFunction<State>]
