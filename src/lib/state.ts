export type State<Type extends string, Properties extends object = {}> = {
  type: Type
} & Properties

export function isSpecificState<
  Type extends string,
  T extends ReadonlyArray<Type>,
  S extends State<Type>
>(...types: T) {
  return (state: S): state is Extract<S, State<T[number]>> =>
    types.includes(state.type)
}

export function foldState<Type extends string, S extends State<Type>, R>(
  branches: { [T in Type]: (state: Extract<S, State<T>>) => R }
) {
  //@ts-expect-error
  return (state: S) => branches[state.type](state)
}

export function partiallyFoldState<
  Type extends string,
  SubType extends Type,
  S extends State<Type>,
  R
>(
  branches: { [T in SubType]: (state: Extract<S, State<T>>) => R },
  defaultBranch: (state: Exclude<S, State<SubType>>) => R
) {
  return (state: S) => {
    const branch = branches[state.type as SubType]
    //@ts-expect-error
    return branch ? branch(state) : defaultBranch(state)
  }
}

export interface Matcher<Type extends string, S extends State<Type>> {
  state: S
  match: <T extends Type>(type: T) => this is Matcher<T, Extract<S, State<T>>>
}

export function matcher<Type extends string, S extends State<Type>>(
  state: S
): Matcher<Type, S> {
  return {
    state,
    match(type) {
      return state.type === type
    },
  }
}
