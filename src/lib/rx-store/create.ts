import { Observable, Subject } from 'rxjs'

import { Store } from 'lib/store'

export type ObservableOf<T> = {
  [K in keyof T as `${K & string}$`]: Observable<T[K]>
}

export type SignalsOf<T> = {
  [K in keyof T]: (value: T[K]) => void
}

export type SubjectsOf<T> = {
  [K in keyof T as `${K & string}$`]: Subject<T[K]>
}

export function createSubjects<Events>(
  keys: ReadonlyArray<keyof Events>
): SubjectsOf<Events> {
  //@ts-expect-error
  return Object.fromEntries(keys.map((key) => [`${key}$`, new Subject()]))
}

export function createSignals<Subjects>(subjects: SubjectsOf<Subjects>): SignalsOf<Subjects> {
  //@ts-expect-error
  return Object.fromEntries(
    Object.entries(subjects).map(([key, subject]) => [
      key.slice(0, -1),
      //@ts-expect-error
      (value) => subject.next(value),
    ])
  )
}

export function createRxStore<
  State,
  Events,
  Args extends ReadonlyArray<any> = []
>(
  createRxState: (
    store: Store<State>,
    events: ObservableOf<Events>,
    ...args: Args
  ) => Observable<State>,
  store: Store<State>,
  events: ReadonlyArray<keyof Events>
): (...args: Args) => SignalsOf<Events> & ObservableOf<{ state: State }>

export function createRxStore<
  State,
  Events,
  Sources,
  Args extends ReadonlyArray<any> = []
>(
  createRxState: (
    store: Store<State>,
    events: ObservableOf<Events & Sources>,
    ...args: Args
  ) => Observable<State>,
  store: Store<State>,
  events: ReadonlyArray<keyof Events>,
  sources: ObservableOf<Sources>
): (...args: Args) => SignalsOf<Events> & ObservableOf<{ state: State }>

export function createRxStore<
  State,
  Events,
  Sources = {},
  Args extends ReadonlyArray<any> = []
>(
  createRxState: (
    store: Store<State>,
    events: ObservableOf<Events & Sources>,
    ...args: Args
  ) => Observable<State>,
  store: Store<State>,
  events: ReadonlyArray<keyof Events>,
  sources?: ObservableOf<Sources>
): (...args: Args) => SignalsOf<Events> & ObservableOf<{ state: State }> {
  const subjects = createSubjects(events)
  const signals = createSignals(subjects)
  return (...rest) => ({
    ...signals,
    state$: createRxState(
      store,
      //@ts-expect-error
      sources ? { ...subjects, ...sources } : subjects,
      ...rest
    ),
  })
}
