import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import RentalAgreement from "@/app/rental-agreement/page";

describe("Rental Agreement", () => {
    it("renders correctly", () => {
        render(<RentalAgreement />);
        expect(screen.getByTestId("rental-agreement")).toBeInTheDocument();
    });
});