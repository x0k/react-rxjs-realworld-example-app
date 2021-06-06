import { Observable, Subject } from 'rxjs'

import {
  ObservableOf,
  SignalsOf,
  StateFactoryOptions,
  StateOptions,
  SubjectsOf,
} from './model'

export function createSubjects<Events>(
  keys: ReadonlyArray<keyof Events>
): SubjectsOf<Events> {
  //@ts-expect-error
  return Object.fromEntries(keys.map((key) => [`${key}$`, new Subject()]))
}

export function createSignals<Subjects>(
  subjects: SubjectsOf<Subjects>
): SignalsOf<Subjects> {
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
  Options extends StateOptions<State, Events>,
  Dependencies extends ReadonlyArray<any> = []
>(
  createRxState: (options: Options, ...args: Dependencies) => Observable<State>,
  options: StateFactoryOptions<State, Events, Options>,
  ...rest: Dependencies
): SignalsOf<Events> & ObservableOf<{ state: State }> {
  const { events } = options
  const signals = createSignals(events)
  return {
    ...signals,
    //@ts-expect-error
    state$: createRxState(options, ...rest),
  }
}
