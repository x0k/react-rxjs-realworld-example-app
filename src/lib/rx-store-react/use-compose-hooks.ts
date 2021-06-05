import { useMemo } from 'react'

import { composeRxHooks, RxHooks } from 'lib/rx-store'

export function useHooksCompose(...hooks: RxHooks[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => composeRxHooks(...hooks), hooks)
}
