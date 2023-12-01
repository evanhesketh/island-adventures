import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const nextAuth =  require("next-auth/react");

import RentalGuide from "@/app/rental-guide/page";

describe("Rental Guide", () => {
    it("renders correctly when signed in", () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            };
            return {data: mockSession, status: "authenticated"}
        });

        render(<RentalGuide />);
        expect(screen.getByTestId("rental-guide")).toBeInTheDocument();
    });
});