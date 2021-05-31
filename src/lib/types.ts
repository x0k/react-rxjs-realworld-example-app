export function isNull<T>(value: T | null): value is null {
  return value === null
}

export function isUndefined<T>(value: T | undefined): value is undefined {
  return value === undefined
}

export function isFalse<T>(value: T | false): value is false {
  return value === false
}

export function isTrue<T>(value: T | true): value is true {
  return value === true
}

export type NotPresent = null | undefined

export function isPresent<T>(value: T | NotPresent): value is T {
  return !isNull(value) && !isUndefined(value)
}

export type Falsy = 0 | '' | null | undefined | false

export function isTruly<T>(value: T | Falsy): value is T {
  return Boolean(value)
}

export type Entry<T> = [string, T]

export function omitProps<T, F, R extends Record<string, T | F>>(
  predicate: (entry: Entry<T | F>) => entry is Entry<T>
) {
  return (record: R): Record<string, T> => {
    const entries = Object.entries(record).filter(predicate)
    return Object.fromEntries(entries)
  }
}

function isTrulyEntry<T>(entry: Entry<T | Falsy>): entry is Entry<T> {
  return isTruly(entry[1])
}

function isNotNullEntry<T>(entry: Entry<T | null>): entry is Entry<T> {
  return !isNull(entry[1])
}

export const omitFalsyProps = omitProps(isTrulyEntry)

export const omitNullProps = omitProps(isNotNullEntry)
