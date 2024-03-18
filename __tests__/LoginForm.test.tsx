import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LoginForm from "@/components/LoginForm";

jest.mock('next/navigation');

describe("LoginForm", () => {
    it("renders correctly", () => {
        render(<LoginForm />);
        expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });
});