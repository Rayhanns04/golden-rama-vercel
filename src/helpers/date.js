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
