interface BookedYearsInterface {
  [year: string]: BookedMonthsInterface;
}

interface BookedMonthsInterface {
  [month: string]: BookedDaysInterface
}

interface BookedDaysInterface {
  [day: string]: string
}

interface BookingDataInterface {
  owners: BookedYearsInterface;
  renters: BookedYearsInterface;
}

interface ProcessedBookedDatesInterface {
  owners?: BookedYearsInterface;
  renters?: BookedYearsInterface;
}

interface RawBookingDataInterface {
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  renter: string;
}

interface CalendarFormPropsInterface {
  month: number;
  year: number;
  forwardClick: () => void;
  backClick: () => void;
}

interface UserInterface {
  name: string
}

interface CarouselInterface {
  visible: boolean;
  photoSet: "interior" | "exterior" | "landscape" | ""
}

interface PhotoInterface {
  src: string;
  caption: string;
}

interface PhotoDataInterface {
  interior: PhotoInterface[],
  exterior: PhotoInterface[],
  landscape: PhotoInterface[]
}

interface RegisterFormInterface {
  name: string,
  password: string,
  confirmPassword: string,
  error: null | string
}

interface ReviewInterface {
  name: string,
  review: string,
  date: string
}

interface ReviewCardPropsInterface {
  review: ReviewInterface
}

interface RateInterface {
  type: string;
  peak: string;
  off: string
}

interface JWTTokenInterface {
  userId: string;
  iat: number;
  exp: number;
}

export type {
  BookedDaysInterface,
  BookedMonthsInterface,
  BookedYearsInterface,
  BookingDataInterface,
  RawBookingDataInterface,
  ProcessedBookedDatesInterface,
  CalendarFormPropsInterface,
  UserInterface,
  CarouselInterface,
  PhotoInterface,
  PhotoDataInterface,
  RegisterFormInterface,
  ReviewInterface,
  ReviewCardPropsInterface, 
  RateInterface,
  JWTTokenInterface
};
