import Image from "next/image";
import Footer from "../../components/Footer";

/** Presentational component for location information plus Google map */
export default function Location() {
  return (
    <div className="relative logged-in" data-testid="location">
      <div className="flex flex-col sm:items-center md:flex-row md:justify-evenly mt-10 mx-2">
        <div className="sm:w-96 mt-4 md:mt-4 lg:mt-0">
          <h4 className="text-2xl mb-4">Directions</h4>
          <div>
            <h5 className="text-lg mb-2">Address:</h5>
            <p>1 Mystery Rd. San Juan Island</p>
            <p className="mt-4">
              From the ferry, turn right, then left, then right, then go straight
              for a while then turn right and you have probably found it!
            </p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d169075.568205881!2d-123.23327516049628!3d48.536954197881826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548f7c0e3729a853%3A0x6095b0616fd36617!2sSan%20Juan%20Island!5e0!3m2!1sen!2sus!4v1701288143723!5m2!1sen!2sus"
            className="h-[350px] w-[350px] lg:h-[400px] lg:w-[400px] rounded-lg mt-6 mb-10"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="sm:w-96 md:self-start md:mt-20">
          <div className="w-[350px] lg:max-w-[400px]">
            <Image
              src={"/photos/exterior/mystery-driveway.jpg"}
              className="rounded-lg"
              alt={"Driveway"}
              width={400}
              height={400}
            />
            <h4 className="mt-2 mb-6">
              Driveway for 1 Mystery Road
            </h4>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
