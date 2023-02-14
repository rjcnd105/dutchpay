import { addDays, endOfDay, isAfter, isBefore, isSameDay, isSunday, startOfDay } from 'date-fns'

import dateUtils from '~/utils/dateUtils'

// 하루
export class Day {
  static today = new Day(new Date())
  static tomorrow = new Day(addDays(Day.today.date, 1))
  readonly #date: Date

  constructor(...args: ConstructorParameters<typeof Date>) {
    this.#date = new Date(...args)
  }

  get date() {
    return this.#date
  }

  get isToday() {
    return Day.today.isSameDay(this.#date)
  }

  get isHoliday() {
    return isSunday(this.#date)
  }

  get koDayOfWeek() {
    return dateUtils.toKoDayOfWeek(this.#date)
  }

  get toString() {
    return dateUtils.toDateString('.')(this.#date)
  }

  get startOf() {
    return startOfDay(this.#date)
  }

  get endOf() {
    return endOfDay(this.#date)
  }

  static fromDate(date: Date) {
    return new Day(date)
  }

  // startDate ~ endDate 사이의 Day[]를 리턴
  static getDayRange(startDate: Date, endDate: Date): Day[] {
    if (!endDate) throw Error('날짜 형식이 잘못되었습니다.')

    const range: Day[] = []
    const end = endOfDay(endDate)

    if (startDate > endDate) return []

    let currentDate = startDate

    while (currentDate <= end) {
      range.push(Day.fromDate(currentDate))
      currentDate = addDays(currentDate, 1)
    }

    return range
  }

  copy() {
    return Day.fromDate(new Date(this.date))
  }

  isAfter(date: Date) {
    return isAfter(endOfDay(this.date), date)
  }

  isBefore(date: Date) {
    return isBefore(startOfDay(this.date), date)
  }

  isAfterEq(date: Date) {
    return this.isSameDay(date) || this.isAfter(date)
  }

  isBeforeEq(date: Date) {
    return this.isSameDay(date) || this.isBefore(date)
  }

  isSameDay(date: Date): boolean {
    return isSameDay(this.#date, date)
  }
}
