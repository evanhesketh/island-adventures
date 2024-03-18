import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ForgotPassword from "@/app/forgot/page";

describe("ForgotPassword", () => {
    it("renders correctly", () => {
        render(<ForgotPassword />);
        expect(screen.getByTestId("password-forgot-form")).toBeInTheDocument();
    });
});