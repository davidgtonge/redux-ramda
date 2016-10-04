import {createReducer} from "../src"
import assert from "assert"
import {assoc, propEq, compose, always} from "ramda"

describe("redux-ramda", () => {
  it("empty spec", () => {
    const reducer = createReducer(null, [])
    const state = {a: Math.random()}
    const action = {type: "TEST"}
    const nextState = reducer(state, action)
    assert.equal(state, nextState)
    assert.deepEqual(state, nextState)
  })

  it("initial state and empty spec", () => {
    const state = {a: Math.random()}
    const reducer = createReducer(state, [])
    const action = {type: "TEST"}
    const nextState = reducer(null, action)
    assert.equal(state, nextState)
    assert.deepEqual(state, nextState)
  })

  it("string predicate", () => {
    const state = {a: 0}
    const type = "TEST"
    const reducer = createReducer(state, [
      [type, assoc("a")]
    ])
    const action = {type, payload: 1}
    const nextState = reducer(null, action)
    assert.equal(nextState.a, 1)
  })

  it("function predicate", () => {
    const state = {a: 0}
    const type = "TEST"
    const reducer = createReducer(state, [
      [propEq("type", type), assoc("a")]
    ])
    const action = {type, payload: 1}
    const nextState = reducer(null, action)
    assert.equal(nextState.a, 1)
  })

  it("multiple reducers", () => {
    const state = {a: 0}
    const type = "TEST"
    const reducer = createReducer(state, [
      [type, [assoc("a"), compose(assoc("b"), always(2))]]
    ])
    const action = {type, payload: 1}
    const nextState = reducer(null, action)
    assert.equal(nextState.a, 1)
    assert.equal(nextState.b, 2)
  })

  it("multiple predicates", () => {
    let state = {}
    const reducer = createReducer(null, [
      ["A", assoc("a")],
      ["B", assoc("b")],
      ["C", assoc("c")]
    ])

    state = reducer(state, {type: "A", payload: 1})
    assert.equal(state.a, 1)
    state = reducer(state, {type: "B", payload: 2})
    assert.equal(state.b, 2)
    state = reducer(state, {type: "C", payload: 3})
    assert.equal(state.c, 3)
    assert.deepEqual(state, {a:1, b:2, c:3})
  })
})
