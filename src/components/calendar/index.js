import React from "react";
import { useQuery } from "@tanstack/react-query";
import Calendar from "react-calendar";
import Holidays from "date-holidays";
import moment from "moment";
import { getPublicHolidays } from "../../services/public_holiday.service";

export const CustomCalendar = (props) => {
  const { data: publicHolidays } = useQuery(
    ["getPublicHolidays"],
    getPublicHolidays
  );
  const hd = new Holidays("ID", "ID");
  const _holidays = hd.getHolidays(new Date().getFullYear());
  const holidays = [..._holidays, ...(publicHolidays || [])];
  return (
    <>
      <Calendar
        calendarType="US"
        locale={"id-ID"}
        tileClassName={({ date, view }) => {
          const holiday = holidays.find(
            (item) =>
              moment(item.date).format("YYYY-MM-DD") ===
              moment(date).format("YYYY-MM-DD")
          );
          return view === "month" && holiday
            ? "react-calendar__month-view__days__day--weekend"
            : null;
        }}
        tileContent={({ date, view }) => {
          const holiday = holidays.find(
            (item) =>
              moment(item.date).format("YYYY-MM-DD") ===
              moment(date).format("YYYY-MM-DD")
          );
          return view === "month" && holiday ? <p>{holiday.name}</p> : null;
        }}
        {...props}
      />
    </>
  );
};

export default CustomCalendar;
