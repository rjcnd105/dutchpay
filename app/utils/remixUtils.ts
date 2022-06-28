export function getStringFormData<K extends string>(formData: FormData, keys: K[]) {
  return Object.fromEntries(
    keys.map(key => {
      const data = formData.get(key)
      if (typeof data !== 'string') throw Error(`data: ${key} is not string`)
      return [key, data]
    }),
  ) as Record<K, string>
}
