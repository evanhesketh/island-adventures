import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const nextAuth =  require("next-auth/react");

import Rates from "@/app/rates/page";

describe("Rates", () => {
    it("renders correctly when signed in", () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            };
            return {data: mockSession, status: "authenticated"}
        });

        render(<Rates />);
        expect(screen.getByTestId("rates")).toBeInTheDocument();
    });
});