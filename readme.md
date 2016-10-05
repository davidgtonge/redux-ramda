redux-ramda
===========

[![Build Status](https://travis-ci.org/davidgtonge/redux-ramda.svg?branch=master)](https://travis-ci.org/davidgtonge/redux-ramda)

Ramda based functional helpers for [redux](http://redux.js.org/)

I like using the `cond` function from Ramda to describe a list of functions that can occur based on an array of predicates.

Redux reducers feel like they could have a similar API - so I made this wrapper.

### Example

```javascript
import {createReducer} from "redux-ramda"
import {assoc, evolve, append} from "ramda"

// ACTION TYPES
const SET_FILTER = "SET_FILTER"
const ADD_TODO = "ADD_TODO"

// ACTION CREATORS
export const setFilter = (filter) => {
  return {type: SET_FILTER, payload: filter}
}
export const addTodo = (todo) => {
  return {type: ADD_TODO, payload: todo}
}

// REDUCER
const initialState = { filter: null, todos: [] }
export const reducer = createReducer(initialState, [
  [SET_FILTER, assoc("filter")],
  [ADD_TODO, (todo) => evolve({todos: append(todo)})],
])

```

### API

`createReducer(initialState, reducerSpec) => reducer`

The reducer spec is a list of [predicate, transform] pairs - similar to `cond`: http://ramdajs.com/docs/#cond

Please see the tests for more examples.

There is some added sugar around the spec:
 - If the predicate isn't a function it will be wrapped in `propEq("type")`, this allows action types to be passed in directly
 - Transform functions are curried and receive the action payload, followed by the current state. They need to return the next state
 - A pass through condition is added automatically
 - Multiple transform functions can be added to a single predicate - useful for re-using transforms, e.g. a RESET action may have the same effect as a RESET_FILTER and RESET_SORT actions combined. With named functions this becomes nice and declarative. For example:

 ```javascript
createReducer(null, [
  [RESET_SORT, resetSortProp],
  [RESET_FILTER, resetFilterProp],
  [RESET, [resetSortProp, resetFilterProp]]
])
 ```
