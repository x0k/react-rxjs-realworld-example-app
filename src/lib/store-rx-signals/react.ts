import { useMemo } from 'react'
import { Subject } from 'rxjs'

import {
  createSignalsHooks,
  createStopSignalHooks,
} from './rx-signals'

export function useSignalsHooks<StartSignal, StopSignal>(
  start: Subject<StartSignal>,
  stop: Subject<StopSignal>,
  startPayload?: StartSignal,
  stopPayload?: StopSignal
) {
  return useMemo(
    () =>
      createSignalsHooks({
        start,
        stop,
        startPayload,
        stopPayload,
      }),
    [start, stop, startPayload, stopPayload]
  )
}

export function useStopSignalHooks<StopSignal>(
  stop: Subject<StopSignal>,
  payload?: StopSignal
) {
  return useMemo(() => createStopSignalHooks(stop, payload), [stop, payload])
}
