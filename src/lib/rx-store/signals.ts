import { RxHooks } from './hooks'

export type HookAction<T> = (value?: T) => void

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
}: CreateSignalsHooksOptions<StartSignal, StopSignal>): RxHooks {
  return {
    afterSubscribe: () => start(startPayload),
    beforeUnsubscribe: () => stop(stopPayload),
  }
}

export function createStartSignalHooks<StartSignal>(
  start: HookAction<StartSignal>,
  payload?: StartSignal
): RxHooks {
  return {
    afterSubscribe: () => start(payload),
  }
}

export function createStopSignalHooks<StopSignal>(
  stop: HookAction<StopSignal>,
  payload?: StopSignal
): RxHooks {
  return {
    beforeUnsubscribe: () => stop(payload),
  }
}
