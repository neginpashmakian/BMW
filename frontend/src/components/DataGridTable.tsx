import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DataGridTable({ cars }: { cars: any[] }) {
  const navigate = useNavigate();

  const [filteredData, setFilteredData] = useState<any[]>(cars);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter controls
  const [field, setField] = useState("Brand");
  const [operator, setOperator] = useState("contains");
  const [value, setValue] = useState("");

  const fieldMap: Record<string, string> = {
    Brand: "Brand",
    Model: "Model",
    Range_km: "Range_km",
  };

  const fields = Object.keys(fieldMap);

  const operators = [
    "contains",
    "equals",
    "starts with",
    "ends with",
    "is empty",
  ];

  // 🔍 Local search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(cars);
    } else {
      const lower = searchTerm.toLowerCase();
      const searched = cars.filter(
        (car) =>
          car.Brand?.toLowerCase().includes(lower) ||
          car.Model?.toLowerCase().includes(lower)
      );
      setFilteredData(searched);
    }
  }, [searchTerm, cars]);

  // 🎯 Backend filter
  const handleBackendFilter = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/data/filter", {
        field: fieldMap[field], // Mapped to DB field
        operator,
        value,
      });
      setFilteredData(response.data);
    } catch (err) {
      console.error("Backend filter failed", err);
    }
  };

  const columns = [
    { field: "Brand", headerName: "Brand", width: 150 },
    { field: "Model", headerName: "Model", width: 250 },
    { field: "Range_km", headerName: "Range (km)", width: 150 },
    {
      field: "details",
      headerName: "Details",
      width: 150,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/detail/${params.row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Box sx={{ width: "90%", maxWidth: 1000 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Electric Car Dashboard
        </Typography>

        {/* 🔍 Search input */}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Search by Brand or Model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* 🎛️ Filter section */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            select
            label="Field"
            value={field}
            onChange={(e) => setField(e.target.value)}
            size="small"
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
            />
          )}

          <Button variant="contained" onClick={handleBackendFilter}>
            Filter
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setFilteredData(cars);
              setField("Brand");
              setOperator("contains");
              setValue("");
            }}
          >
            Reset
          </Button>
        </Stack>

        {/* 📊 Table */}
        <DataGrid
          rows={filteredData.map((car) => ({ id: car._id, ...car }))}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableColumnMenu
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          autoHeight
        />
      </Box>
    </Box>
  );
}
