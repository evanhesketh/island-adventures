import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import RentalGuide from "@/app/rental-guide/page";

describe("Rental Guide", () => {
    it("renders correctly", () => {
        render(<RentalGuide />);
        expect(screen.getByTestId("rental-guide")).toBeInTheDocument();
    });
});