import { Dayjs } from "dayjs";

class Calendar {
  monthGrid: number[][];

  constructor(date: Dayjs) {
    this.monthGrid = this._createMonthGrid(date);
  }
 
  _createMonthGrid(date: Dayjs): number[][] {
    const numDaysInMonth = date.daysInMonth();
    const firstDayOfMonth = date.startOf("month").day();
    const offset = 1 - firstDayOfMonth;
    const daysWithPadding = [];

    //populate array with zeros for padding start of month
    for (let i = offset; i <= numDaysInMonth; i++) {
      if (i <= 0) {
        daysWithPadding.push(0);
      } else {
        daysWithPadding.push(i);
      }
    }

    const monthGrid = [];

    //create monthGrid where each week is an array with length 7
    for (let i = 0; i < daysWithPadding.length; i += 7) {
      const week = daysWithPadding.slice(i, i + 7);
      monthGrid.push(week);
    }

    const lastWeek = monthGrid[monthGrid.length - 1];

    //ensure final week in month is padded with zeros as needed
    while (lastWeek.length < 7) {
      lastWeek.push(0);
    }

    return monthGrid;
  }
}

export default Calendar;