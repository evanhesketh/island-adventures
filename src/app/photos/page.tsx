"use client";

import { useState, MouseEvent } from "react";
import Image from "next/image";

import { CarouselInterface, PhotoDataInterface } from "../../../types/interfaces";
import Carousel from "../../components/Carousel";
import Footer from "../../components/Footer";
import { photoData } from "@/photo-data";

/** Photo gallery landing page
 * State:
 *  -carousel: {visible: false, photoSet: "interior"}
 * 
 * Photos -> Carousel
 */
export default function Photos() {
  const [carousel, setCarousel] = useState<CarouselInterface>({
    visible: false,
    photoSet: "",
  });

  function handleClick(evt: MouseEvent) {
    const target = evt.target as HTMLImageElement;
    const id = target.id as "exterior" | "interior" | "landscape";

    setCarousel({ visible: true, photoSet: id });
  }

  function closeCarousel() {
    setCarousel({ visible: false, photoSet: "" });
  }

  return (
    <div data-testid="photos">
      {carousel.visible === false && (
        <div className="relative logged-in">       
        <div className="text-center pt-10">
          <h3 className="text-2xl mb-5">Take a look around!</h3>
          <p>Click on a photo to view the gallery</p>
        </div>
        <div
          className={`flex flex-col items-center sm:flex-wrap sm:flex-row sm:justify-evenly mt-20 mx-2`}
        >
          <div>
            <p className="text-center text-lg">House</p>
          <Image
            className="mx-1 mb-5 md:my-4 hover:cursor-pointer rounded-lg hover:brightness-125"
            id="interior"
            src={"/photos/interior/room2.jpg"}
            alt="Living room"
            width={350}
            height={350}
            onClick={handleClick}
            data-testid="interior"
          />
          </div>
          <div>
            <p className="text-center text-lg">Property</p>
          <Image
            className="mx-1 mb-5 md:my-4 hover:cursor-pointer rounded-lg hover:brightness-125"
            id="exterior"
            src={"/photos/exterior/cabin1.jpg"}
            alt="Exterior of Property"
            width={350}
            height={350}
            onClick={handleClick}
          />
          </div>
          <div>
            <p className="text-center text-lg">Island</p>
          <Image
            className="mx-1 mb-5 md:my-4 hover:cursor-pointer rounded-lg hover:brightness-125"
            id="landscape"
            src={"/photos/island/point.jpg"}
            alt="Landscape of Island"
            width={350}
            height={350}
            onClick={handleClick}
          />
          </div>
        </div>
        <Footer />
        </div>

      )}
      {carousel.visible && (
       <div className="relative logged-in">
        <Carousel
          photos={photoData[carousel.photoSet as keyof PhotoDataInterface]}
          handleClose={closeCarousel}
        />
      <Footer />
       </div>

      )}
    </div>
  );
}
