import { format, getISODay } from 'date-fns/fp'

export const KOR_DAY_OF_WEEK = ['월', '화', '수', '목', '금', '토', '일'] as const

function toKoDayOfWeek(date: Date) {
  return KOR_DAY_OF_WEEK[getISODay(date) - 1]
}
function formatLocalISO(date: Date) {
  return format('yyyy-MM-dd')(date) + 'T' + format('HH:mm:ss')(date)
}

// yyyy.MM.dd
const toDateString = (separator = '.') => format(`yyyy${separator}MM${separator}dd`)
// MM.dd
const toMonthDate = (separator = '.') => format(`MM${separator}dd`)
// yyyy.MM
const toYearMonth = (separator = '.') => format(`yyyy${separator}MM`)

const toKoMonthDay = format('MM월 dd일')
const toKoMonth = format('MM월')

const dateUtils = {
  toKoDayOfWeek,
  formatLocalISO,

  toDateString,
  toMonthDate,
  toYearMonth,
  toKoMonthDay,
  toKoMonth,
}

export default dateUtils
