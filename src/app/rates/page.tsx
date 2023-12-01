import { rates } from "@/rental-rates";
import Footer from "../../components/Footer";

/** Presentational component for rental rates */
export default function Rates() {
  return (
    <div className="relative logged-in mx-2" data-testid="rates">
      <div className="text-center pt-10 mb-7">
        <h3 className="text-2xl sm:text-3xl mb-2">Rental Rates</h3>
        <h3 className="text-lg sm:text-lg">September 1, 2023 to August 30, 2024</h3>
      </div>
      <div className="flex justify-center">
      <table className="table-fixed bg-white border border-black">
        <thead>
          <tr className="rates-header font-bold text-lg h-20">
            <th className="w-40"></th>
            <th className="w-40">Peak Season</th>
            <th className="w-40">Off Season</th>
          </tr>
        </thead>
        <tbody className="">
          {rates.map((rate, idx) => {
            return (
              <tr key={idx} className="text-center h-10">
                <td className="">{rate.type}</td>
                <td className="">{rate.peak}</td>
                <td className="">{rate.off}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <Footer />
    </div>
  );
}
