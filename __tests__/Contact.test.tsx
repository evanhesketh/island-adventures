import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const nextAuth =  require("next-auth/react");

import Contact from "@/app/contact/page";

describe("Contact", () => {
    it("renders correctly when signed in", () => {
        nextAuth.useSession = jest.fn(() => {
            const mockSession = {
                user: {name: "guest"}
            };
            return {data: mockSession, status: "authenticated"}
        });

        render(<Contact />);
        expect(screen.getByTestId("contact")).toBeInTheDocument();
    });
});