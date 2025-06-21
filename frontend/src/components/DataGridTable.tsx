import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DataGridTable({ cars }: { cars: any[] }) {
  const navigate = useNavigate();
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

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      const filtered = searchTerm
        ? cars.filter(
            (car) =>
              car.Brand?.toLowerCase().includes(lower) ||
              car.Model?.toLowerCase().includes(lower)
          )
        : cars;
      setFilteredData(filtered);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, cars]);

  const handleBackendFilter = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/data/filter", {
        field: fieldMap[field],
        operator,
        value,
      });
      setFilteredData(response.data);
    } catch (err) {
      console.error("Backend filter failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setFilteredData((prev) => prev.filter((row) => row._id !== id));
  };

  const baseColumns =
    filteredData.length > 0
      ? Object.keys(filteredData[0])
          .filter((key) => key !== "_id")
          .map((key) => ({
            field: key,
            headerName: key.replace(/_/g, " "),
            flex: 1,
            minWidth: 120,
            renderCell: (params: any) => (
              <Tooltip title={params.value?.toString() || ""}>
                <span>{params.value}</span>
              </Tooltip>
            ),
          }))
      : [];

  const columns = [
    ...baseColumns,
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/detail/${params.row.id}`)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Entry">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
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
        px: 2,
        overflowX: "auto",
      }}
    >
      <Paper
        elevation={4}
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

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
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

            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Box sx={{ minWidth: 1000 }}>
                <DataGrid
                  rows={filteredData.map((car) => ({ id: car._id, ...car }))}
                  columns={columns}
                  disableColumnMenu
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                  }}
                  pageSizeOptions={[10]}
                  disableRowSelectionOnClick
                  autoHeight
                  density="compact"
                  loading={loading}
                  sx={{
                    transition: "opacity 0.3s ease-in-out",
                    opacity: loading ? 0.5 : 1,
                  }}
                />
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
