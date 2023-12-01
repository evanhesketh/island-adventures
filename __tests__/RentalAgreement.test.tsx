import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const nextAuth =  require("next-auth/react");

import RentalAgreement from "@/app/rental-agreement/page";

describe("Rental Agreement", () => {
    it("renders correctly when signed in", () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            };
            return {data: mockSession, status: "authenticated"}
        });

        render(<RentalAgreement />);
        expect(screen.getByTestId("rental-agreement")).toBeInTheDocument();
    });
});