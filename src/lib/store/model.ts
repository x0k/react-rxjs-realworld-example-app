export interface Store<State> {
  state: State
  set: (value: State) => void
}
