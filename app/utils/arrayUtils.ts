const basicMatcher = <T>(a: T, b: T) => a === b

const matchRemove =
  <T>(matchFn = basicMatcher) =>
  (arr: T[], removeItem: T) => {
    for (let i = 0; i < arr.length; i++) {
      if (matchFn(arr[i], removeItem)) {
        const newArr = [...arr]
        newArr.splice(i, 1)
        return newArr
      }
    }

    return arr
  }

const arrayUtils = { matchRemove }
export default arrayUtils
