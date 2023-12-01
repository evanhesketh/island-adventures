import Footer from "../../components/Footer";

/** Presentational component for rental agreement */
export default function RentalAgreement() {
  return (
    <div className="relative logged-in" data-testid="rental-agreement">
      <div className="flex justify-center">
        <div className="w-[600px] md:w-[800px] border border-black bg-white p-4 mt-4 mx-2">
          <p className="rental-agreement font-bold text-center text-xl">
            Rental Agreement
          </p>

          <p className="rental-agreement">
            Thank you for choosing our home on 1 Mystery Road for
            your vacation. We hope you enjoy your stay.
          </p>
          <p className="rental-agreement">
            Your confirmed reservation is as follows:
          </p>

          <p className="rental-agreement">
            No. of nights: ______ <br /> Check in time and date: _____ <br />{" "}
            Check out time of date: _____
          </p>

          <p className="rental-agreement">
            <span className="font-bold">Rules</span> Do not destroy the place!
          </p>

          <p className="rental-agreement">Date:&nbsp;</p>

          <p className="rental-agreement">Signed:</p>

          <p className="rental-agreement">
            ------------------------------------
          </p>

          <p className="rental-agreement">
            ------------------------------------
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
