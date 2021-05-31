export interface Store<State> {
  state: State
  set: (value: State) => void
}

export function createStorageStoreFactory(storage: Storage) {
  return <S>(key: string, defaultState: S): Store<S> => {
    return {
      get state() {
        const value = storage.getItem(key)
        return value === null ? defaultState : JSON.parse(value)
      },
      set(value) {
        if (value === null) {
          storage.removeItem(key)
        } else {
          storage.setItem(key, JSON.stringify(value))
        }
      },
    }
  }
}

export const createLocalStorageStore = createStorageStoreFactory(localStorage)

export function createMemoryStore<State>(initialState: State): Store<State> {
  let state = initialState
  return {
    get state() {
      return state
    },
    set(value) {
      state = value
    },
  }
}
