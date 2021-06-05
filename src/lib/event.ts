import { ChangeEvent, FormEvent } from 'react'

import { HookAction, VoidHookAction } from 'lib/rx-store'

export interface ChangeFieldEventPayload<T, F extends keyof T = keyof T> {
  field: F
  value: T[F]
}

export function createFieldChangeHandlers<T>(
  event: HookAction<ChangeFieldEventPayload<T>>,
  ...fields: ReadonlyArray<keyof T>
) {
  return fields.map(
    (field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      //@ts-expect-error
      event({ field, value: e.target.value })
  )
}

export function createFormSubmitHandler(event: VoidHookAction) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    event(undefined)
  }
}
