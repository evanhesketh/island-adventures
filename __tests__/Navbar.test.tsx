import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";

const nextAuth =  require("next-auth/react");

import Navbar from "@/components/Navbar";

jest.mock('next/navigation');

describe("Navbar", () => {
    it("renders correctly when signed out", async () => {
        nextAuth.useSession = jest.fn(() => {
            return {data: null, status: "unauthenticated"}
        });

        render(<Navbar />);
        expect(await screen.findByText("Please log in to access features")).toBeVisible();
    });

    it("renders correctly when signed in as guest", async () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            }
            return {data: mockSession, status: "authenticated"}
        });
      render(<Navbar />);
      expect(screen.getByTestId("nav-links")).toBeInTheDocument();
      expect(screen.queryByTestId("nav-admin")).not.toBeInTheDocument();
    });

    it("renders correctly when signed in as admin", async () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "admin", role:"admin"}
            }
            return {data: mockSession, status: "authenticated"}
        });
      render(<Navbar />);
      expect(screen.getByTestId("nav-links")).toBeInTheDocument();
      expect(screen.getByTestId("nav-admin")).toBeInTheDocument();
    });
});