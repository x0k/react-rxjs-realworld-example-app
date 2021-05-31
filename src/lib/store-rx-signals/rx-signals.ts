import { Subject } from 'rxjs'

import { RxHooks } from 'lib/store-rx-state'

export interface CreateSignalsHooksOptions<StartSignal, StopSignal> {
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
}: CreateSignalsHooksOptions<StartSignal, StopSignal>): RxHooks<any, any> {
  return {
    afterSubscribe: () => start.next(startPayload),
    beforeUnsubscribe: () => stop.next(stopPayload),
  }
}

export function createStopSignalHooks<StopSignal>(
  stop: Subject<StopSignal>,
  payload?: StopSignal
): RxHooks<any, any> {
  return {
    beforeUnsubscribe: () => stop.next(payload),
  }
}
