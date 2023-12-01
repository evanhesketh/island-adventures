"use client";

import { useState } from "react";
import CarouselCard from "./CarouselCard";
import { PhotoInterface } from "../../types/interfaces";

interface CarouselPropsInterface {
  photos: PhotoInterface[];
  handleClose: () => void;
}

/** Carousel: displays images and arrows to navigate through them
 *
 * Props:
 * - photos: array of {src, caption} objects
 * - handleClose: function to close Carousel
 *
 * State:
 * - currCardIdx: integer for current card index
 *
 * /photos --> Carousel --> CarouselCard
 */
function Carousel({ photos, handleClose }: CarouselPropsInterface) {
  const [currCardIdx, setCurrCardIdx] = useState(0);
  const [photoLoading, setPhotoLoading] = useState(true);

  const currCard = photos[currCardIdx];
  const total = photos.length;

  //Increments currCardIdx state by 1
  function goForward() {
    setCurrCardIdx(currCardIdx + 1);
    setPhotoLoading(true);
  }

  //Decrements currCardIdx state by 1
  function goBackward() {
    setCurrCardIdx(currCardIdx - 1);
    setPhotoLoading(true);
  }

  function toggleLoadingState() {
    setPhotoLoading(false);
  }

  return (
    <div className="flex justify-center" data-testid="carousel">
      <div className="flex flex-col items-center mt-10">
        <div>
          <button
            className="bg-sky-900 px-4 py-2 text-lg text-white hover:bg-sky-700 rounded-lg"
            onClick={() => handleClose()}
          >
            Back to galleries
          </button>
        </div>
        <div className="mt-4">
          <button
            className="rounded-lg"
            onClick={goBackward}
            disabled={currCardIdx !== 0 ? false : true}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-10 h-10 mx-3 rounded-full  ${
                currCardIdx !== 0 ? "hover:bg-gray-200" : "text-gray-400"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button
            className=""
            onClick={goForward}
            disabled={currCardIdx !== total - 1 ? false : true}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-10 h-10 mx-3 rounded-full ${
                currCardIdx !== total - 1
                  ? "hover:bg-gray-200"
                  : "text-gray-400"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        <CarouselCard
          caption={currCard.caption}
          src={currCard.src}
          currNum={currCardIdx + 1}
          totalNum={total}
          toggleLoadingState={toggleLoadingState}
          loading={photoLoading}
        />
      </div>
    </div>
  );
}

export default Carousel;
