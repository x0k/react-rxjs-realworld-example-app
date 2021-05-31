import { useCallback, useEffect } from 'react'
import { Observable } from 'rxjs'

import { useForceUpdate, useLazyRef } from 'lib/hooks'

import { RxHooks, RxStates, RxStateStatus } from './model'
import { createSuspender } from './suspender'

export type RxStateOptions<T, E> = RxHooks<T, E> & {
  initialValue?: T
  compare?: (a: T, b: T) => boolean
}

export function useRxState<T, E = Error>(
  observable: Observable<T>,
  options: RxStateOptions<T, E> = {}
) {
  const forceUpdate = useForceUpdate()
  const {
    initialValue,
    compare = Object.is,
    afterSubscribe,
    beforeUnsubscribe,
  } = options
  let stateRef = useLazyRef<RxStates<T, E>>(() =>
    initialValue !== undefined
      ? { type: RxStateStatus.IDLE, data: initialValue }
      : { type: RxStateStatus.Init, suspender: createSuspender() }
  )
  const subscribe = useCallback(
    () =>
      observable.subscribe({
        next: (data) => {
          const { current } = stateRef
          stateRef.current = { type: RxStateStatus.IDLE, data }
          if (current.type === RxStateStatus.Init) {
            current.suspender.resolve()
          } else if (
            current.type === RxStateStatus.IDLE &&
            !compare(current.data, data)
          ) {
            forceUpdate()
          }
        },
        error: (error) => {
          const { current } = stateRef
          stateRef.current = { type: RxStateStatus.Error, error }
          if (current.type === RxStateStatus.Init) {
            current.suspender.resolve()
          } else {
            forceUpdate()
          }
        },
        complete: () => {
          const { current } = stateRef
          stateRef.current = { type: RxStateStatus.Complete }
          if (current.type === RxStateStatus.Init) {
            current.suspender.resolve()
          }
        },
      }),
    [compare, forceUpdate, observable, stateRef]
  )
  const subscriptionRef = useLazyRef(subscribe)
  useEffect(() => {
    if (subscriptionRef.current.closed) {
      subscriptionRef.current = subscribe()
    }
    afterSubscribe?.(stateRef.current)
    return () => {
      beforeUnsubscribe?.(stateRef.current)
      subscriptionRef.current.unsubscribe()
    }
  }, [afterSubscribe, beforeUnsubscribe, stateRef, subscribe, subscriptionRef])
  const { current } = stateRef
  switch (current.type) {
    case RxStateStatus.Init: {
      throw current.suspender.promise
    }
    case RxStateStatus.IDLE: {
      return current.data
    }
    case RxStateStatus.Error: {
      throw current.error
    }
    case RxStateStatus.Complete: {
      throw new Error('Unexpected end of stream')
    }
  }
}
