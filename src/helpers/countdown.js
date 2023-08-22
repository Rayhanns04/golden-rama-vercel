export const getTimeRemaining = (endtime) => {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.max(Math.floor((total / 1000) % 60), 0)
    .toString()
    .padStart(2, "0");
  const minutes = Math.max(Math.floor((total / 1000 / 60) % 60), 0)
    .toString()
    .padStart(2, "0");
  const hours = Math.max(Math.floor((total / (1000 * 60 * 60)) % 24), 0)
    .toString()
    .padStart(2, "0");
  const days = Math.max(Math.floor(total / (1000 * 60 * 60 * 24)), 0)
    .toString()
    .padStart(2, "0");

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};
