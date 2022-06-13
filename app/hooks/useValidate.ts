import type { Predicate } from 'fp-ts/Predicate'

const useValidate =
  <T>(pred: Predicate<T>) =>
  (initial: T) => {}
export default useValidate
