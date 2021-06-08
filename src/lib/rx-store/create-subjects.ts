import { Subject } from 'rxjs'

import { SubjectsOf } from './model'

export function createSubjects<Events>(
  keys: ReadonlyArray<keyof Events>
): SubjectsOf<Events> {
  //@ts-expect-error
  return Object.fromEntries(keys.map((key) => [`${key}$`, new Subject()]))
}
