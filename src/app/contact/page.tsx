import Footer from "../../components/Footer";

/** Presentational component for contact info */
export default function Contact() {
  return (
    <div className="relative logged-in" data-testid="contact">
      <div className="text-center pt-10">
        <h3 className="mt-4 text-xl">
          For booking inquiries, please contact Mr. Mystery
        </h3>
        <h4 className="mt-4 text-lg font-bold">Email:</h4>
        <p className="mt-3">mysteryman@notarealemail.com</p>
      </div>
      <Footer />
    </div>
  );
}
