import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Contact from "@/app/contact/page";

describe("Contact", () => {
    it("renders correctly", () => {        
        render(<Contact />);
        expect(screen.getByTestId("contact")).toBeInTheDocument();
    });
});