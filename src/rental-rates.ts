import { RateInterface } from "../types/interfaces";

export const rates: RateInterface[] = [
  { type: "Couple", peak: "$1", off: "$0" },
  { type: "Three adults", peak: "$2", off: "$1" },
  { type: "Two couples", peak: "$3", off: "$2" },
  { type: "5-7 people", peak: "$4", off: "$3" },
  { type: "8-9 people", peak: "$5", off: "$4" },
  { type: "10 people", peak: "$6", off: "$5" },
];
