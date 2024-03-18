import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import Rates from "@/app/rates/page";

describe("Rates", () => {
    it("renders correctly", () => {
        render(<Rates />);
        expect(screen.getByTestId("rates")).toBeInTheDocument();
    });
});