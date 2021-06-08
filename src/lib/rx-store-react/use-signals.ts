import { Subject } from 'rxjs'
import { useMemo } from 'react'

import {
  createSignalsHooks,
  createStartSignalHooks,
  createStopSignalHooks,
  RxHooks,
} from 'lib/rx-store'

export function useSignalsHooks<StartSignal, StopSignal>(
  start: Subject<StartSignal>,
  stop: Subject<StopSignal>,
  startPayload?: StartSignal,
  stopPayload?: StopSignal
): RxHooks {
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

export function useStartSignalHooks<StartSignal>(
  start: Subject<StartSignal>,
  payload?: StartSignal
) {
  return useMemo(() => createStartSignalHooks(start, payload), [start, payload])
}

export function useStopSignalHooks<StopSignal>(
  stop: Subject<StopSignal>,
  payload?: StopSignal
) {
  return useMemo(() => createStopSignalHooks(stop, payload), [stop, payload])
}
