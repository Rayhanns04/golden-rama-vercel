/* eslint-disable import/no-anonymous-default-export */
// app/_lib/format.js

import format from "date-fns/format";
import { id } from "date-fns/locale";

const locales = { id };

// by providing a default string of 'PP' or any of its variants for `formatStr`
// it will format dates in whichever way is appropriate to the locale
export default function (date, formatStr = "PP") {
  if (isNaN(date)) return "";
  try {
    return format(date, formatStr, {
      locale: id, // or global.__localeId__
    });
  } catch (e) {
    return "";
  }
}

export function calculateTimeDifference(baseTime, timeArray) {
  const [baseHours, baseMinutes] = baseTime.split(':').map(Number);
  const baseTotalMinutes = baseHours * 60 + baseMinutes;

  const totalMinutesArray = timeArray.reduce((total, time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return total + totalMinutes;
  }, 0);

  const timeDifference = baseTotalMinutes - totalMinutesArray;

  const hours = Math.floor(timeDifference / 60);
  const minutes = timeDifference % 60;

  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

export function calculateTimeTotalTransitDifference(time2, time1) {
  const [hours1, minutes1] = time1.split(":").map(Number);
  const [hours2, minutes2] = time2.split(":").map(Number);

  const date1 = new Date(0, 0, 0, hours1, minutes1);
  const date2 = new Date(0, 0, 0, hours2, minutes2);

  const timeDifferenceInMillis = date2 - date1;

  const hoursDiff = Math.floor(timeDifferenceInMillis / 3600000);
  const minutesDiff = Math.floor((timeDifferenceInMillis % 3600000) / 60000);

  const formattedDiff = `${String(hoursDiff).padStart(2, "0")}:${String(minutesDiff).padStart(2, "0")}`;
  
  return formattedDiff;
}

export function getMonthFromMonthName(name) {
  const monthsLong = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  return monthsLong[name];
}
