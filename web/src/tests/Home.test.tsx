import React from "react";
import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Home from "../pages/Home";

describe("Home Component", () => {
  test("renders welcome message", () => {
    const { getByText } = render(<Home />);
    const welcomeMessage = getByText(/Welcome to the React Starter App/i);
    expect(document.body.contains(welcomeMessage)).to.be.true;
  });
});
