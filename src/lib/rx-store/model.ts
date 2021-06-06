import { Store } from 'lib/store'
import { MonoTypeOperatorFunction, Observable, Subject } from 'rxjs'

export type ObservableOf<T> = {
  [K in keyof T as `${K & string}$`]: Observable<T[K]>
}

export type SignalsOf<T> = {
  [K in keyof T]: (value: T[K]) => void
}

export type SubjectsOf<T> = {
  [K in keyof T as `${K & string}$`]: Subject<T[K]>
}

export type StateOptions<State, Events, Sources = void> = {
  store: Store<State>
  events: ObservableOf<Events>
} & (Sources extends {}
  ? {
      sources: ObservableOf<Sources>
    }
  : {})

export type StateSignals<Signals> = {
  signals: SignalsOf<Signals>
}

export type StateHandlers<State> =
  | [Observable<State>]
  | [Observable<State>, MonoTypeOperatorFunction<State>]

export type StateFactoryOptions<
  State,
  Events,
  Options extends StateOptions<State, Events>
> = Omit<Options, 'events'> & {
  events: SubjectsOf<Events>
}
