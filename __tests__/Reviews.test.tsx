import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Reviews from "@/app/reviews/page";

describe("Reviews", () => {
    it("renders correctly", () => {
        render(<Reviews />);
        expect(screen.getByTestId("reviews")).toBeInTheDocument();
    });
});