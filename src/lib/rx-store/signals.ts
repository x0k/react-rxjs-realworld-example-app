import { Subject } from 'rxjs'

import { RxHooks } from './hooks'

interface CreateSignalsHooksOptions<StartSignal, StopSignal> {
  start: Subject<StartSignal>
  stop: Subject<StopSignal>
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
    afterSubscribe: () => start.next(startPayload),
    beforeUnsubscribe: () => stop.next(stopPayload),
  }
}

export function createStartSignalHooks<StartSignal>(
  start: Subject<StartSignal>,
  payload?: StartSignal
): RxHooks {
  return {
    afterSubscribe: () => start.next(payload),
  }
}

export function createStopSignalHooks<StopSignal>(
  stop: Subject<StopSignal>,
  payload?: StopSignal
): RxHooks {
  return {
    beforeUnsubscribe: () => stop.next(payload as StopSignal),
  }
}
