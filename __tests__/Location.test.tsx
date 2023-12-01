import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const nextAuth =  require("next-auth/react");

import Location from "@/app/location/page";

describe("Location", () => {
    it("renders correctly when signed in", () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            };
            return {data: mockSession, status: "authenticated"}
        });

        render(<Location />);
        expect(screen.getByTestId("location")).toBeInTheDocument();
    });

    // it("renders correctly when signed out", () => {
    //     nextAuth.useSession = jest.fn(() => {
    //         return {data: {}, status: "unauthenticated"}
    //     });

    //     render(<Location />);
    //     expect(screen.queryByTestId("location")).not.toBeInTheDocument();
    // });
});