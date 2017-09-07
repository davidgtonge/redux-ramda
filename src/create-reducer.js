import {is, unless, always, T, identity, cond, propEq,
  adjust, compose, reduce, map, of, append, curry, 
} from "ramda"

const passThroughSpec = [T, always(identity)]
const ensureCondFunction = unless(
  is(Function),
  propEq("type")
)

const fnReducer = curry((payload, memo, fn) =>
  fn(payload)(memo)
)

const createPayloadReducer = curry((fn, action, state) => {
  const payload = action.payload
  const fns = unless(is(Array), of)(fn)
  return reduce(fnReducer(payload), state, fns)
})

const ensureCondSpec = compose(
  adjust(ensureCondFunction, 0),
  adjust(createPayloadReducer, 1)
)

const createReducerSpec = compose(
  cond,
  append(passThroughSpec),
  map(ensureCondSpec)
)

const createReducer = (initialState, spec) => {
  const reducer = createReducerSpec(spec)
  return (state, action = {}) => reducer(action)(state)
}

export default createReducer
