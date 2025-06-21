import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Register necessary modules for AG Grid
ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function DataGridTable({ cars }: { cars: any[] }) {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [field, setField] = useState("Brand");
  const [operator, setOperator] = useState("contains");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fieldMap: Record<string, string> = {
    Brand: "Brand",
    Model: "Model",
    Range_km: "Range_Km",
  };

  const fields = Object.keys(fieldMap);
  const operators = [
    "contains",
    "equals",
    "starts with",
    "ends with",
    "is empty",
  ];

  // ✅ Filter logic (simulate loading + search)
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      const result = searchTerm
        ? cars.filter(
            (car) =>
              car.Brand?.toLowerCase().includes(lower) ||
              car.Model?.toLowerCase().includes(lower)
          )
        : cars;
      setFilteredData(result);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, cars]);

  const handleBackendFilter = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5000/data/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field: fieldMap[field],
          operator,
          value,
        }),
      });
      const data = await response.json();
      setFilteredData(data);
    } catch (err) {
      console.error("Backend filter error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setFilteredData((prev) => prev.filter((row) => row._id !== id));
  };

  // ✅ AG Grid column definition
  const columnDefs = useMemo(() => {
    if (!filteredData.length) return [];

    const dynamicCols = Object.keys(filteredData[0])
      .filter((key) => key !== "_id")
      .map((key) => ({
        field: key,
        headerName: key.replace(/_/g, " "),
        sortable: true,
        filter: true,
        resizable: true,
        tooltipField: key,
        flex: 1,
        minWidth: 120,
      }));

    return [
      ...dynamicCols,
      {
        headerName: "Actions",
        cellRenderer: (params: any) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Details">
              <Button
                size="small"
                color="primary"
                onClick={() => navigate(`/detail/${params.data._id}`)}
              >
                <VisibilityIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(params.data._id)}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </Tooltip>
          </Stack>
        ),
        width: 150,
        pinned: "right" as const,
        suppressSizeToFit: true,
      },
    ];
  }, [filteredData]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1300,
          px: 4,
          py: 4,
          borderRadius: 3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1c69d4" }}
        >
          Electric Car Dashboard
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Search by Brand or Model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          useFlexGap
          flexWrap="wrap"
          sx={{ mb: 3 }}
        >
          <TextField
            select
            label="Field"
            value={field}
            onChange={(e) => setField(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {fields.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Operator"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {operators.map((op) => (
              <MenuItem key={op} value={op}>
                {op}
              </MenuItem>
            ))}
          </TextField>

          {operator !== "is empty" && (
            <TextField
              label="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            />
          )}

          <Button
            variant="contained"
            sx={{ backgroundColor: "#1c69d4", minWidth: 100 }}
            onClick={handleBackendFilter}
          >
            Filter
          </Button>

          <Button
            variant="outlined"
            sx={{ minWidth: 100 }}
            onClick={() => {
              setFilteredData(cars);
              setField("Brand");
              setOperator("contains");
              setValue("");
              setSearchTerm("");
            }}
          >
            Reset
          </Button>
        </Stack>

        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Box
            className="ag-theme-alpine"
            sx={{
              height: 400,
              width: "100%",
              fontFamily: `"Roboto", "Helvetica Neue", "Arial", sans-serif`,
              fontSize: "13px",
              borderRadius: 2,
              overflow: "hidden",

              // Light gray cell text
              "& .ag-cell": {
                color: "#3e3e3e",
                fontWeight: 400,
                lineHeight: "1.5rem",
                borderBottom: "1px solid #f0f0f0",
              },

              // Header font and style
              "& .ag-header-cell-label": {
                color: "#1f1f1f",
                fontWeight: 600,
                fontSize: "13px",
              },

              // Remove inner borders for a softer look
              "& .ag-root-wrapper, .ag-cell, .ag-header-cell": {
                border: "none",
              },

              // Row hover
              "& .ag-row:hover .ag-cell": {
                backgroundColor: "#f9f9f9",
              },

              // Pagination styling (optional)
              "& .ag-paging-panel": {
                borderTop: "1px solid #f0f0f0",
                fontSize: "12px",
                color: "#5e5e5e",
              },
            }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={filteredData}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
              animateRows={true}
              domLayout="normal"
              pagination={true}
              paginationPageSize={10}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
