import { Observable, Subject } from 'rxjs'
import { Store } from './store'

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

export function createSignals<S, Subjects extends SubjectsOf<S>>(
  subjects: Subjects
): SignalsOf<S> {
  //@ts-expect-error
  return Object.fromEntries(
    Object.entries(subjects).map(([key, subject]) => [
      key.slice(0, -1),
      //@ts-expect-error
      (value) => subject.next(value),
    ])
  )
}

export function createRxStore<State, Events, Args extends ReadonlyArray<any> = []>(
  createRxState: (
    store: Store<State>,
    events: ObservableOf<Events>,
    ...args: Args
  ) => Observable<State>,
  store: Store<State>
): (
  events: ReadonlyArray<keyof Events>,
  ...args: Args
) => SignalsOf<Events> & ObservableOf<{ state: State }>

export function createRxStore<
  State,
  Events,
  Sources,
  Args extends ReadonlyArray<any> = [],
>(
  createRxState: (
    store: Store<State>,
    events: ObservableOf<Events & Sources>,
    ...args: Args
  ) => Observable<State>,
  store: Store<State>,
  sources: ObservableOf<Sources>
): (
  events: ReadonlyArray<keyof Events>,
  ...args: Args
) => SignalsOf<Events> & ObservableOf<{ state: State }>

export function createRxStore<
  State,
  Events,
  Sources = {},
  Args extends ReadonlyArray<any> = [],
>(
  createRxState: (
    store: Store<State>,
    events: ObservableOf<Events & Sources>,
    ...args: Args
  ) => Observable<State>,
  store: Store<State>,
  sources?: ObservableOf<Sources>
): (
  events: ReadonlyArray<keyof Events>,
  ...args: Args
) => SignalsOf<Events> & ObservableOf<{ state: State }> {
  return (events, ...rest) => {
    const subjects = createSubjects(events)
    return {
      ...createSignals<Events, SubjectsOf<Events>>(subjects),
      state$: createRxState(
        store,
        //@ts-expect-error
        sources ? { ...subjects, ...sources } : subjects,
        ...rest
      ),
    }
  }
}
