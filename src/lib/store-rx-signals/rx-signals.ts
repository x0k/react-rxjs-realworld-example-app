import { RxHooks } from 'lib/store-rx-state'

import { HookAction } from './model'

export interface CreateSignalsHooksOptions<StartSignal, StopSignal> {
  start: HookAction<StartSignal>
  stop: HookAction<StopSignal>
  startPayload?: StartSignal
  stopPayload?: StopSignal
}

export function createSignalsHooks<StartSignal, StopSignal>({
  start,
  stop,
  startPayload,
  stopPayload,
}: CreateSignalsHooksOptions<StartSignal, StopSignal>): RxHooks<any, any> {
  return {
    afterSubscribe: () => start(startPayload),
    beforeUnsubscribe: () => stop(stopPayload),
  }
}

export function createStartSignalHooks<StartSignal>(
  start: HookAction<StartSignal>,
  payload?: StartSignal
): RxHooks<any, any> {
  return {
    afterSubscribe: () => start(payload),
  }
}

export function createStopSignalHooks<StopSignal>(
  stop: HookAction<StopSignal>,
  payload?: StopSignal
): RxHooks<any, any> {
  return {
    beforeUnsubscribe: () => stop(payload),
  }
}
