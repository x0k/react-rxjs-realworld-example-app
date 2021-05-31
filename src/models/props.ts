import { ElementType, ReactNode } from 'react'

export type ClassNameProp = {
  className?: string
}

export type ChildrenProp = {
  children?: ReactNode
}

export type AsProp<E extends ElementType> = {
  as?: E
} & (E extends ElementType<infer P> ? P : never)
