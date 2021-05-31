import { useMemo } from 'react'

import { RxHooks } from './model'

export function composeRxHooks<T, E>(...hooks: RxHooks<T, E>[]): RxHooks<T, E> {
  return {
    afterSubscribe(state) {
      hooks.forEach((hook) => hook.afterSubscribe?.(state))
    },
    beforeUnsubscribe(state) {
      hooks.forEach((hook) => hook.beforeUnsubscribe?.(state))
    },
  }
}

export function useHooksCompose<T, E>(
  ...hooks: RxHooks<T, E>[]
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => composeRxHooks(...hooks), hooks)
}
