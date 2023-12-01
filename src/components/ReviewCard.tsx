import { ReviewCardPropsInterface } from "../../types/interfaces";

/** Presentational component for a review card */
export default function ReviewCard({ review }: ReviewCardPropsInterface) {
  return (
    <div className="w-96 mx-4 mb-4 border border-black rounded-lg bg-white">
      <p className="p-2">{review.review}</p>
      <p className="py-4 px-2 font-bold">
        {review.name}, <span className="font-normal italic">{review.date}</span>
      </p>
    </div>
  );
}
