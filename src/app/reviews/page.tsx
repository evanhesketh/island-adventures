import ReviewCard from "@/components/ReviewCard";
import { reviews } from "@/reviews";
import Footer from "../../components/Footer";

/** Presentational component for reviews */
export default function Reviews() {
  return (
    <div className="pt-10 mb-4 relative-logged-in" data-testid="reviews">
      <h3 className="text-2xl md:text-3xl mx-10 sm:mx-20 md:mx-40 italic">Here&apos;s what people are saying:</h3>
        <div className="flex flex-col items-center md:flex-row md:flex-wrap md:justify-evenly my-10">
            {reviews.map((review, idx) => <ReviewCard key={idx} review={review}/>)}
        </div>
      {/* <Footer /> */}
    </div>
  );
}
