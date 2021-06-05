import { useMemo } from 'react'

import { HookAction } from './model'
import {
  createSignalsHooks,
  createStartSignalHooks,
  createStopSignalHooks,
} from './rx-signals'

export function useSignalsHooks<StartSignal, StopSignal>(
  start: HookAction<StartSignal>,
  stop: HookAction<StopSignal>,
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

export function useStartSignalHooks<StartSignal>(
  start: HookAction<StartSignal>,
  payload?: StartSignal
) {
  return useMemo(() => createStartSignalHooks(start, payload), [start, payload])
}

export function useStopSignalHooks<StopSignal>(
  stop: HookAction<StopSignal>,
  payload?: StopSignal
) {
  return useMemo(() => createStopSignalHooks(stop, payload), [stop, payload])
}
