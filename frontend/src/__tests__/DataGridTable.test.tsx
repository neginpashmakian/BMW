import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import DataGridTable from "../components/DataGridTable";

// Mock useNavigate from react-router
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockCars = [
  {
    _id: "1",
    Brand: "Tesla",
    Model: "Model S",
    AccelSec: 2.5,
    TopSpeed_KmH: 250,
    Range_Km: 500,
    Efficiency_WhKm: 180,
    FastCharge_KmH: 600,
  },
  {
    _id: "2",
    Brand: "BMW",
    Model: "i4",
    Range_Km: 450,
  },
];

describe("DataGridTable component", () => {
  it("renders title and search field", () => {
    render(
      <MemoryRouter>
        <DataGridTable cars={mockCars} />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText(/Search by Brand or Model/i)
    ).toBeInTheDocument();
  });

  it("renders correct number of rows", async () => {
    render(
      <MemoryRouter>
        <DataGridTable cars={mockCars} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Tesla")).toBeInTheDocument();
      expect(screen.getByText("BMW")).toBeInTheDocument();
    });
  });

  it("filters data using search input", async () => {
    render(
      <MemoryRouter>
        <DataGridTable cars={mockCars} />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Search by Brand or Model/i);
    fireEvent.change(input, { target: { value: "Tesla" } });

    await waitFor(() => {
      expect(screen.getByText("Tesla")).toBeInTheDocument();
      expect(screen.queryByText("BMW")).not.toBeInTheDocument();
    });
  });

  it("clicks on View Details triggers navigation", async () => {
    render(
      <MemoryRouter>
        <DataGridTable cars={mockCars} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole("button", {
        name: /View Details/i,
      });
      fireEvent.click(buttons[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/detail/1");
  });
});
