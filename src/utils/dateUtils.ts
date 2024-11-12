import { Event } from '../types.ts';

export type WeekType = 'none' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/**
 * 주어진 년도와 월의 일수를 반환합니다.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 주어진 날짜가 속한 주의 모든 날짜를 반환합니다.
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const sunday = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(sunday);
    nextDate.setDate(sunday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
}

/**
 * 주어진 날짜가 속한 월의 모든 날짜를 반환합니다.
 */
export function getWeeksAtMonth(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month + 1);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = [];

  const initWeek = () => Array(7).fill(null);

  let week: Array<number | null> = initWeek();

  for (let i = 0; i < firstDayOfMonth; i++) {
    week[i] = null;
  }

  for (const day of days) {
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    week[dayIndex] = day;
    if (dayIndex === 6 || day === daysInMonth) {
      weeks.push(week);
      week = initWeek();
    }
  }

  return weeks;
}

/**
 * 주어진 날짜에 속한 이벤트를 반환합니다.
 */
export function getEventsForDay(events: Event[], date: number): Event[] {
  return events.filter((event) => new Date(event.date).getDate() === date);
}

/**
 * 주어진 날짜의 연도, 월, 주차 정보 "YYYY년 M월 w주" 형식으로 반환합니다.
 */
export function formatWeek(targetDate: Date) {
  const dayOfWeek = targetDate.getDay();
  const diffToThursday = 4 - dayOfWeek;
  const thursday = new Date(targetDate);
  thursday.setDate(targetDate.getDate() + diffToThursday);

  const year = thursday.getFullYear();
  const month = thursday.getMonth() + 1;

  const firstDayOfMonth = new Date(thursday.getFullYear(), thursday.getMonth(), 1);

  const firstThursday = new Date(firstDayOfMonth);
  firstThursday.setDate(1 + ((4 - firstDayOfMonth.getDay() + 7) % 7));

  const weekNumber: number =
    Math.floor((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return `${year}년 ${month}월 ${weekNumber}주`;
}

/**
 * 주어진 날짜의 월 정보를 "YYYY년 M월" 형식으로 반환합니다.
 */
export function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * 주어진 날짜가 특정 범위 내에 있는지 확인합니다.
 */
export function isDateInRange(date: Date, rangeStart: Date, rangeEnd: Date): boolean {
  const normalizedDate = stripTime(date);
  const normalizedStart = stripTime(rangeStart);
  const normalizedEnd = stripTime(rangeEnd);

  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
}

/**
 * 한 자리수의 날짜는 0을 붙여 두 자리수의 날짜로 반환합니다.
 */
export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, '0');
}

/**
 * 주어진 날짜를 "YYYY-MM-DD" 형식으로 반환합니다.
 */
export function formatDate(currentDate: Date, day?: number) {
  return [
    currentDate.getFullYear(),
    fillZero(currentDate.getMonth() + 1),
    fillZero(day ?? currentDate.getDate()),
  ].join('-');
}

/**
 * 주어진 날짜가 윤년에 해당하는지 boolean 값으로 반환합니다.
 */
export function isLeapYear(targetDate: Date): boolean {
  // 연도 추출
  const year = targetDate.getFullYear();

  const FOUR = 4;
  const HUNDRED = 100;
  // 윤년 확인
  if (year % (FOUR * HUNDRED) === 0) return true;
  if (year % HUNDRED === 0) return false;
  return year % FOUR === 0;
}

/**
 * 현재 날짜부터 종료 날짜까지 설정된 간격으로 남은 날짜들을 반환합니다.
 */
export function getRemainingDatesByDay(startDate: Date, endDate: Date, interval: number = 1) {
  const dates: Date[] = [];

  // 종료일이 시작일보다 이전인 경우 빈 배열 반환합니다.
  if (endDate < startDate) {
    return dates;
  }

  // 간격이 0보다 작거나 같을 경우 빈 배열을 반환합니다.
  if (interval <= 0) {
    return dates;
  }

  let current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + interval);
  }
  return dates;
}

/**
 * 주어진 날짜의 요일을 short 형태의 string으로 반환합니다. (예: mon, tue, wed, ...)
 */
export function getWeekday(date: Date): string {
  try {
    const weekdayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
    return weekdayFormat.format(date).toLowerCase();
  } catch (error) {
    return 'none';
  }
}

