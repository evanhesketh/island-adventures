import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const nextAuth =  require("next-auth/react");

import RegisterForm from "@/app/admin/page";

const unmockedFetch = global.fetch

beforeAll(() => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ name: "guest" }]),
    }),
  ) as jest.Mock;
});

afterAll(() => {
  global.fetch = unmockedFetch
});

describe("Register Form", () => {
    it("renders correctly when signed in as admin", async () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "admin", role:"admin"}
            }
            return {data: mockSession, status: "authenticated"}
        });
      render(<RegisterForm />);

      await waitFor(() => {
          expect(screen.getByTestId("register-form")).toBeInTheDocument();
      });
    });

    it("renders correctly when signed in as guest", async () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            }
            return {data: mockSession, status: "authenticated"}
        });
      render(<RegisterForm />);

      await waitFor(() => {
          expect(screen.getByTestId("unauthorized")).toBeInTheDocument();
      });
    });
})