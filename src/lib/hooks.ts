import { MutableRefObject, useRef, useState } from 'react'

export function useForceUpdate() {
  const update = useState(0)[1]
  return useRef(() => update((value) => value + 1)).current
}

export function useLazyRef<T>(get: () => T) {
  const isFirstRender = useRef(true)
  const ref = useRef(isFirstRender.current && get())
  isFirstRender.current = false
  return ref as MutableRefObject<T>
}
