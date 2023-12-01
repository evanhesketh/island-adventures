import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const nextAuth =  require("next-auth/react");

import Reviews from "@/app/reviews/page";

describe("Reviews", () => {
    it("renders correctly when signed in", () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            };
            return {data: mockSession, status: "authenticated"}
        });

        render(<Reviews />);
        expect(screen.getByTestId("reviews")).toBeInTheDocument();
    });
});