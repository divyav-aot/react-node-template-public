import React from "react";
import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { BrowserRouter } from "react-router";
import Navigation from "../components/common/Navigation";

describe("Navigation Component", () => {
  test("renders navigation links", () => {
    const { getByText } = render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    expect(document.body.contains(getByText(/Home/i))).to.be.true;
    expect(document.body.contains(getByText(/About/i))).to.be.true;
    expect(document.body.contains(getByText(/Users/i))).to.be.true;
  });
});
