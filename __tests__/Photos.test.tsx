import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const nextAuth =  require("next-auth/react");

import Photos from "@/app/photos/page";

describe("Photos", () => {
    it("renders correctly when signed in", () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            }
            return {data: mockSession, status: "authenticated"}
        });

        render(<Photos />);
        expect(screen.getByTestId("photos")).toBeInTheDocument();
    });

    it("renders carousel when photo clicked", () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            }
            return {data: mockSession, status: "authenticated"}
        });

        render(<Photos />);
        fireEvent.click(screen.getByTestId("interior"));
        expect(screen.getByTestId("carousel")).toBeInTheDocument();
    });
});