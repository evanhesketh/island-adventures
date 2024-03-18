import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Location from "@/app/location/page";

describe("Location", () => {
    it("renders correctly", () => {
        render(<Location />);
        expect(screen.getByTestId("location")).toBeInTheDocument();
    });
});