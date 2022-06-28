import { useCallback, useMemo, useReducer, useRef } from 'react'

type CheckReducerActions =
  | {
      type: 'ADD' | 'REMOVE'
      value: string
    }
  | { type: 'RESET'; value: string[] }
  | { type: 'CLEAR' }

function checkReducer(state: Set<string>, action: CheckReducerActions) {
  switch (action.type) {
    case 'ADD': {
      const newSet = new Set(state)
      newSet.add(action.value)
      return newSet
    }
    case 'REMOVE': {
      const newSet = new Set(state)
      newSet.delete(action.value)
      return newSet
    }

    case 'CLEAR': {
      return new Set<string>()
    }

    case 'RESET': {
      return new Set(action.value)
    }

    default:
      return state
  }
}

export function useCheckboxState(initialState: string[]) {
  const defaultState = useRef(initialState)
  const [checkSet, dispatch] = useReducer(checkReducer, new Set(initialState))
  const checkArr = useMemo(() => [...checkSet], [checkSet])

  const add = useCallback((value: string) => dispatch({ type: 'ADD', value }), [])
  const remove = useCallback((value: string) => dispatch({ type: 'REMOVE', value }), [])
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET', value: defaultState.current }), [])

  return { values: checkArr, add, remove, clear, reset, has: checkSet.has }
}
