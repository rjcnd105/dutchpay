const numberUtils = {
  thousandsSeparators(num: string | number) {
    const numParts = (typeof num === 'string' ? num : num.toString()).split('.')
    if (!numParts[0]) return String(num)
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return numParts.join('.')
  },

  removeSeparators: (str: string) => str.replaceAll(',', ''),
}

export default numberUtils
