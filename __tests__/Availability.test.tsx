import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Availability from "@/app/availability/page";

const nextAuth = require("next-auth/react");

describe("Availability", () => {
  it("renders correctly when signed in as guest", async () => {
    nextAuth.useSession = jest.fn(() => {
      const mockSession = {
        user: { name: "guest", role: "user" },
      };
      return { data: mockSession, status: "authenticated" };
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            processedBookingData: { owners: {}, renters: {} },
          }),
      })
    ) as jest.Mock;

    render(<Availability />);
    expect(await screen.findByTestId("public-calendar")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId("private-calendar")).not.toBeInTheDocument()
    );
  });

  it("renders correctly when signed in as admin", async () => {
    nextAuth.useSession = jest.fn(() => {
      const mockSession = {
        user: { name: "admin", role: "admin" },
      };
      return { data: mockSession, status: "authenticated" };
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            processedBookingData: { owners: {}, renters: {} },
          }),
      })
    ) as jest.Mock;

    render(<Availability />);
    expect(await screen.findByTestId("private-calendar")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId("public-calendar")).not.toBeInTheDocument()
    );
  });
});
