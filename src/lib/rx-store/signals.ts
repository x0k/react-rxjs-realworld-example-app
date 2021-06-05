import { RxHooks } from './hooks'

export type HookAction<T> = (value: T) => void
export type VoidHookAction = (value: unknown) => void

interface CreateSignalsHooksOptions<StartSignal, StopSignal> {
  start: HookAction<StartSignal>
  stop: HookAction<StopSignal>
  startPayload?: StartSignal
  stopPayload?: StopSignal
}

export function createSignalsHooks<StartSignal, StopSignal>(options: {
  start: HookAction<StartSignal>
  stop: HookAction<StopSignal>
  startPayload: StartSignal
  stopPayload: StopSignal
}): RxHooks

export function createSignalsHooks<StartSignal>(options: {
  start: HookAction<StartSignal>
  stop: VoidHookAction
  startPayload: StartSignal
}): RxHooks

export function createSignalsHooks<StopSignal>(options: {
  start: VoidHookAction
  stop: HookAction<StopSignal>
  stopPayload: StopSignal
}): RxHooks

export function createSignalsHooks(options: {
  start: VoidHookAction
  stop: VoidHookAction
}): RxHooks

export function createSignalsHooks<StartSignal, StopSignal>({
  start,
  stop,
  startPayload,
  stopPayload,
}: CreateSignalsHooksOptions<StartSignal, StopSignal>): RxHooks {
  return {
    afterSubscribe: () => start(startPayload as StartSignal),
    beforeUnsubscribe: () => stop(stopPayload as StopSignal),
  }
}

export function createStartSignalHooks<StartSignal>(
  start: HookAction<StartSignal>,
  payload: StartSignal
): RxHooks

export function createStartSignalHooks(start: VoidHookAction): RxHooks

export function createStartSignalHooks<StartSignal>(
  start: HookAction<StartSignal>,
  payload?: StartSignal
): RxHooks {
  return {
    afterSubscribe: () => start(payload as StartSignal),
  }
}

export function createStopSignalHooks<StopSignal>(
  stop: HookAction<StopSignal>,
  payload?: StopSignal
): RxHooks

export function createStopSignalHooks(stop: VoidHookAction): RxHooks

export function createStopSignalHooks<StopSignal>(
  stop: HookAction<StopSignal>,
  payload?: StopSignal
): RxHooks {
  return {
    beforeUnsubscribe: () => stop(payload as StopSignal),
  }
}
