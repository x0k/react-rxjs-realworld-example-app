import { ChangeEvent, FormEvent } from 'react'
import { Subject } from 'rxjs'

export interface ChangeFieldEventPayload<T, F extends keyof T = keyof T> {
  field: F
  value: T[F]
}

export function createFieldChangeHandlers<T>(
  event: Subject<ChangeFieldEventPayload<T>>,
  ...fields: ReadonlyArray<keyof T>
) {
  return fields.map(
    (field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      //@ts-expect-error
      event.next({ field, value: e.target.value })
  )
}

export function createFormSubmitHandler<T>(event: Subject<T>) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    event.next()
  }
}
