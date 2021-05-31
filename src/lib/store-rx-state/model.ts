import { State } from 'lib/state'

export enum RxStateStatus {
  Init = 'init',
  IDLE = 'idle',
  Error = 'error',
  Complete = 'complete',
}

export interface Suspender {
  promise: Promise<any>
  resolve: () => void
}

export type RxStates<T, E> =
  | State<RxStateStatus.Init, { suspender: Suspender }>
  | State<RxStateStatus.IDLE, { data: T }>
  | State<RxStateStatus.Error, { error: E }>
  | State<RxStateStatus.Complete>

export interface RxHooks<T, E> {
  afterSubscribe?: (state: RxStates<T, E>) => void
  beforeUnsubscribe?: (state: RxStates<T, E>) => void
}
