import { useCallback, useMemo, useReducer, useRef } from 'react';

type SetReducerActions =
  | {
      type: 'ADD' | 'REMOVE';
      value: string;
    }
  | { type: 'RESET'; value: string[] }
  | { type: 'CLEAR' };

function setReducer(state: Set<string>, action: SetReducerActions) {
  switch (action.type) {
    case 'ADD': {
      const newSet = new Set(state);
      newSet.add(action.value);
      return newSet;
    }
    case 'REMOVE': {
      const newSet = new Set(state);
      newSet.delete(action.value);
      return newSet;
    }

    case 'CLEAR': {
      return new Set<string>();
    }

    case 'RESET': {
      return new Set(action.value);
    }

    default:
      return state;
  }
}

export type SetState = ReturnType<typeof useSetState>;
export function useSetState(initialState: string[]) {
  const defaultState = useRef(initialState);
  const [set, dispatch] = useReducer(setReducer, new Set(initialState));
  const setArr = useMemo(() => [...set], [set]);

  const add = useCallback((value: string) => dispatch({ type: 'ADD', value }), []);
  const remove = useCallback((value: string) => dispatch({ type: 'REMOVE', value }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET', value: defaultState.current }), []);

  return { state: setArr, add, remove, clear, reset, has: set.has, defaultState: defaultState.current };
}
