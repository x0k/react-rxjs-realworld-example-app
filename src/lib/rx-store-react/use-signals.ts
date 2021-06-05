import { useMemo } from 'react'

import { HookAction } from 'lib/rx-store'
import {
  createSignalsHooks,
  createStartSignalHooks,
  createStopSignalHooks,
} from 'lib/rx-store'
import { RxHooks } from 'lib/rx-store/hooks'
import { VoidHookAction } from 'lib/rx-store/signals'

export function useSignalsHooks(
  start: VoidHookAction,
  stop: VoidHookAction
): RxHooks

export function useSignalsHooks<StartSignal>(
  start: HookAction<StartSignal>,
  stop: VoidHookAction,
  startPayload: StartSignal
): RxHooks

export function useSignalsHooks<StartSignal, StopSignal>(
  start: HookAction<StartSignal>,
  stop: HookAction<StopSignal>,
  startPayload: StartSignal,
  stopPayload: StopSignal
): RxHooks

export function useSignalsHooks<StartSignal, StopSignal>(
  start: HookAction<StartSignal>,
  stop: HookAction<StopSignal>,
  startPayload?: StartSignal,
  stopPayload?: StopSignal
): RxHooks {
  return useMemo(
    () =>
      createSignalsHooks({
        //@ts-expect-error
        start,
        //@ts-expect-error
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
  return useMemo(
    () => createStartSignalHooks(start, payload as StartSignal),
    [start, payload]
  )
}

export function useStopSignalHooks<StopSignal>(
  stop: HookAction<StopSignal>,
  payload?: StopSignal
) {
  return useMemo(() => createStopSignalHooks(stop, payload), [stop, payload])
}
