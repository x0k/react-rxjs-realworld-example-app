export interface RxHooks {
  afterSubscribe?: () => void
  beforeUnsubscribe?: () => void
}

export function composeRxHooks(...hooks: RxHooks[]): RxHooks {
  return {
    afterSubscribe() {
      hooks.forEach((hook) => hook.afterSubscribe?.())
    },
    beforeUnsubscribe() {
      hooks.forEach((hook) => hook.beforeUnsubscribe?.())
    },
  }
}

