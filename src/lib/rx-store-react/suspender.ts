import { Suspender } from './model'

export function createSuspender(): Suspender {
  let resolve: (value?: any) => void
  const promise = new Promise<any>((res) => {
    resolve = res
  })
  return {
    promise,
    resolve: resolve!,
  }
}
