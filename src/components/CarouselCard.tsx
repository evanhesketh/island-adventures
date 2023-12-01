import Image from "next/image";
import Loading from "@/app/loading";

interface CardPropsInterface {
  caption: string;
  src: string;
  currNum: number;
  totalNum: number;
  toggleLoadingState: () => void;
  loading: boolean;
}

/** CarouselCard: displays image.
 *
 * Props:
 * - caption: string describing the image
 * - src: string for the image link
 * - currNum: integer for what image we're on
 * - totalNum: integer for how many images are in the collection
 *
 * State:
 * - none
 *
 * Carousel --> Card
 */

export default function CarouselCard({
  caption,
  src,
  currNum,
  totalNum,
  toggleLoadingState,
  loading,
}: CardPropsInterface) {
  return (
    <div className="flex flex-col items-center">
      <h4 className="mb-1">{caption}</h4>
      <div className="sm:h-[400px] md:h-[500px] lg:h-[600px] mx-2 sm:mx-0">
        {loading && <Loading />}
        
          <Image
            className={`${loading ? "invisible" : "block"} rounded-lg sm:max-h-[400px] md:max-h-[500px] lg:max-h-[600px] xl:max-h-[600px] 2xl:max-h-none`}
            src={src}
            alt={caption}
            width={800}
            height={600}
            style={{ width: "auto" }}
            onLoad={() => toggleLoadingState()}
          />
       
      </div>
      <small className="mt-1 italic">
        Image {currNum} of {totalNum}.
      </small>
    </div>
  );
}
