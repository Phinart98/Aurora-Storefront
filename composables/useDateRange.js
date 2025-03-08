import {
  format,
  startOfToday,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";

export const useDateRange = () => {
  const getDateRange = (period) => {
    const now = new Date();
    let start = now;

    switch (period) {
      case "today":
        start = startOfToday();
        return {
          start,
          end: now,
          display: format(now, "MMM d, yyyy"),
        };
      case "week":
        start = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        start = startOfMonth(now);
        break;
      case "year":
        start = startOfYear(now);
        break;
    }

    return {
      start,
      end: now,
      display: `${format(start, "MMM d, yyyy")} - ${format(
        now,
        "MMM d, yyyy"
      )}`,
    };
  };

  return {
    getDateRange,
  };
};
