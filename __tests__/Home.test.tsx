import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const nextAuth = require("next-auth/react");

import Home from "@/app/page";

jest.mock("next/navigation");

describe("Home", () => {
  it("renders correctly when signed out", () => {
    nextAuth.useSession = jest.fn(() => {
      return { data: null, status: "unauthenticated" };
    });
    render(<Home />);
    const logIn = screen.queryByTestId("login-btn");
    expect(logIn).toBeInTheDocument();
  });

  it("renders correctly when signed in", () => {
    nextAuth.useSession = jest.fn(() => {
      const mockSession = {
        user: { name: "guest" },
      };
      return { data: mockSession, status: "authenticated" };
    });
    render(<Home />);
    expect(screen.queryByTestId("login-btn")).not.toBeInTheDocument();
  });

  it("renders login form when login button clicked", () => {
    nextAuth.useSession = jest.fn(() => {
      return { data: {}, status: "unauthenticated" };
    });
    render(<Home />);
    fireEvent.click(screen.getByTestId("login-btn"));
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
