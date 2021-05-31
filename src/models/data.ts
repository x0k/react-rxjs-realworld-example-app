import { State } from 'lib/state'

export enum DataStatus {
  Init = 'init',
  Loading = 'loading',
  IDLE = 'idle',
  Error = 'Error',
}

export type DataStates<T, E> =
  | State<DataStatus.Init>
  | State<DataStatus.Loading>
  | State<DataStatus.IDLE, { data: T }>
  | State<DataStatus.Error, { error: E }>
