import { Location, State } from 'history'

interface FromState {
  from: Location<State>
}

export function isLocationWithFromState(
  location: Location<State>
): location is Location<FromState> {
  return location.state !== null && 'from' in location.state
}
