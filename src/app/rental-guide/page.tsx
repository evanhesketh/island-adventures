import Image from "next/image";
import Footer from "../../components/Footer";

/** Presentational component for rental guide */
export default function RentalGuide() {
  return (
    <div className="relative logged-in" data-testid="rental-guide">
      <div className="flex justify-center">
        <div className="w-[600px] md:w-[800px] border border-black bg-white p-4 mt-4 mx-2">
          <p className="rental-guide font-bold text-center text-xl">
            Welcome to our Home
          </p>

          <p className="rental-guide">
            <span className="font-bold">We hope you enjoy your stay.</span>{" "}
            Here are some things you need to
            know about staying on this unique property.
          </p>
          <p className="rental-guide">
            <span className="rental-guide-header font-bold underline">
              Check-in
            </span>
            3 pm
          </p>
          <p className="rental-guide">
            <span className="rental-guide-header font-bold underline">
              Check-out
            </span>
            11 am
          </p>
          <p className="rental-guide">
            <span className="rental-guide-header font-bold underline">
              Supplies
            </span>
            You will find them.
          </p>
          <p className="rental-guide">
            <span className="rental-guide-header font-bold underline">
              Water Conservation
            </span>
            Be smart.
          </p>
          <p className="rental-guide">
            <span className="rental-guide-header font-bold underline">
              Recycling and Garbage
            </span>
            Please recycle and throw out garbage.
          </p>

          
          <p className="rental-guide">
            <span className="rental-guide-header font-bold underline">
              Internet
            </span>
            You are here to unwind. No wifi provided.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
