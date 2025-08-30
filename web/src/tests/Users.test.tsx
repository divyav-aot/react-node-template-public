import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, test, expect, beforeEach, vi, Mock } from "vitest";
import axios from "axios";
import store from "../store"; // real store
import Users from "../pages/Users";

vi.mock("axios");
const mockedAxios = axios as unknown as { post: Mock; get: Mock };
mockedAxios.get.mockResolvedValue({ data: { users: [] } });

function renderWithStore(ui: React.ReactElement) {
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("Users Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the Users component with form fields", async () => {
    await act(async () => {
      renderWithStore(<Users />);
    });

    expect(screen.getByLabelText(/First Name/i)).to.exist;
    expect(screen.getByLabelText(/Middle Name/i)).to.exist;
    expect(screen.getByLabelText(/Last Name/i)).to.exist;
    expect(screen.getByLabelText(/Date of Birth/i)).to.exist;
    expect(screen.getByRole("button", { name: /Save User/i })).to.exist;
  });

  test("submits the form successfully", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { message: "User saved successfully!" },
    });

    renderWithStore(<Users />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
      target: { value: "1990-01-01" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save User/i }));
    });

    expect(await screen.findByText(/User saved successfully!/i)).to.exist;
  });

  test("displays an error message on form submission failure", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Error saving user."));

    renderWithStore(<Users />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
      target: { value: "1985-05-15" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save User/i }));
    });

    expect(await screen.findByText(/Error saving user./i)).to.exist;
  });
});
