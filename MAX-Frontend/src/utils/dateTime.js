/**
 * Real-Time & Temporal Utilities for MAX AI
 * Provides real-time clock formatting, stardate telemetry, and conversational time/date responses.
 */

export function getNow() {
  return new Date();
}

/**
 * Format live time in 12-hour or 24-hour notation
 */
export function formatTime(date = new Date(), is24Hour = false, showSeconds = true) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const pad = (n) => String(n).padStart(2, '0');

  if (is24Hour) {
    return {
      formatted: `${pad(hours)}:${pad(minutes)}${showSeconds ? `:${pad(seconds)}` : ''}`,
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      period: null,
      is24Hour: true
    };
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return {
    formatted: `${pad(displayHours)}:${pad(minutes)}${showSeconds ? `:${pad(seconds)}` : ''} ${period}`,
    hours: pad(displayHours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    period,
    is24Hour: false
  };
}

/**
 * Format live date in various formats
 */
export function formatDate(date = new Date()) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthsShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const dayName = days[date.getDay()];
  const dayNameShort = daysShort[date.getDay()];
  const monthName = months[date.getMonth()];
  const monthNameShort = monthsShort[date.getMonth()];
  const dayNum = date.getDate();
  const year = date.getFullYear();

  // Day of the year calculation
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // ISO Date string YYYY-MM-DD
  const pad = (n) => String(n).padStart(2, '0');
  const isoDate = `${year}-${pad(date.getMonth() + 1)}-${pad(dayNum)}`;

  return {
    dayName,
    dayNameShort,
    monthName,
    monthNameShort,
    dayNum,
    year,
    dayOfYear,
    isoDate,
    fullDisplay: `${dayName}, ${monthName} ${dayNum}, ${year}`,
    cyberDisplay: `${dayNameShort} // ${pad(dayNum)}.${pad(date.getMonth() + 1)}.${year}`,
    headerDisplay: `${dayNameShort}, ${pad(dayNum)} ${monthNameShort} ${year}`
  };
}

/**
 * Get Timezone Information and UTC Offset
 */
export function getTimezoneInfo(date = new Date()) {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const mins = Math.abs(offsetMinutes) % 60;
    const formattedOffset = `UTC${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

    return {
      timeZone,
      offset: formattedOffset,
      display: `${timeZone.split('/').pop().replace(/_/g, ' ')} (${formattedOffset})`
    };
  } catch {
    return {
      timeZone: 'Local',
      offset: 'UTC',
      display: 'Local Time (UTC)'
    };
  }
}

/**
 * Detect if user query is asking about real time or date
 * Returns response object or null
 */
export function checkTimeDateQuery(userPrompt) {
  if (!userPrompt || typeof userPrompt !== 'string') return null;

  const text = userPrompt.toLowerCase().trim();
  const now = new Date();
  const timeInfo = formatTime(now, false, false);
  const dateInfo = formatDate(now);

  const isAskingTime = 
    text.includes('what time') || 
    text.includes("what's the time") || 
    text.includes('current time') || 
    text.includes('tell me the time') || 
    text === 'time' || 
    text.includes('clock');

  const isAskingDate = 
    text.includes('what date') || 
    text.includes("what's the date") || 
    text.includes("today's date") || 
    text.includes('current date') || 
    text.includes('what day') || 
    text === 'date' || 
    text.includes('calendar');

  const isAskingBoth = 
    (isAskingTime && isAskingDate) || 
    text.includes('time and date') || 
    text.includes('real time');

  if (isAskingBoth) {
    return {
      handled: true,
      text: `The current time is ${timeInfo.formatted}, and today is ${dateInfo.fullDisplay}. All system chrono sensors are synchronized.`,
      shortText: `${timeInfo.formatted} • ${dateInfo.fullDisplay}`
    };
  }

  if (isAskingTime) {
    return {
      handled: true,
      text: `The current time is ${timeInfo.formatted}.`,
      shortText: timeInfo.formatted
    };
  }

  if (isAskingDate) {
    return {
      handled: true,
      text: `Today is ${dateInfo.fullDisplay}.`,
      shortText: dateInfo.fullDisplay
    };
  }

  return null;
}
