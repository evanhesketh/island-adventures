import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import Photos from "@/app/photos/page";

describe("Photos", () => {
    it("renders correctly", () => {
        render(<Photos />);
        expect(screen.getByTestId("photos")).toBeInTheDocument();
    });

    it("renders carousel when photo clicked", () => {
        render(<Photos />);
        fireEvent.click(screen.getByTestId("interior"));
        expect(screen.getByTestId("carousel")).toBeInTheDocument();
    });
});