import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import App from "../App";

describe("App Component", () => {
  test("renders learn react link", () => {
    render(<App />);
    expect(screen.getByText((content) => content.trim() === "Vite + React")).to
      .exist;
  });
});
