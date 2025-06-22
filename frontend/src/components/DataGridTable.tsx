// DataGridTable.tsx

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ColumnMenuTab } from "ag-grid-community";
import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function DataGridTable({ cars }: { cars: any[] }) {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [field, setField] = useState("Brand");
  const [operator, setOperator] = useState("contains");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const showLoading = () => setIsLoading(true);
  const hideOverlay = () => {
    setIsLoading(false);
    gridApi?.hideOverlay();
  };

  // Local search filter
  useEffect(() => {
    if (!gridApi) return;
    showLoading();
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
      hideOverlay();
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, cars, gridApi]);

  const handleBackendFilter = async () => {
    if (!gridApi) return;
    showLoading();
    try {
      const resp = await fetch("http://127.0.0.1:5000/data/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: fieldMap[field], operator, value }),
      });
      const data = await resp.json();
      setFilteredData(data);
    } catch (err) {
      console.error(err);
    } finally {
      hideOverlay();
    }
  };

  const handleDelete = (id: string) => {
    setFilteredData((prev) => prev.filter((row) => row._id !== id));
  };

  const columnDefs: ColDef[] = useMemo(() => {
    if (!filteredData.length) return [];
    const dynamicCols = Object.keys(filteredData[0])
      .filter((key) => key !== "_id")
      .map(
        (key): ColDef => ({
          field: key,
          headerName: key.replace(/_/g, " "),
          headerTooltip: key.replace(/_/g, " "),
          sortable: true,
          filter: true,
          resizable: true,
          tooltipField: key,
          flex: 1,
          minWidth: 120,
          suppressMovable: false, // ▶️ Allow dragging
          menuTabs: [
            "filterMenuTab",
            "generalMenuTab",
            "columnsMenuTab",
          ] as ColumnMenuTab[],
          cellRenderer: (params: any) => (
            <Tooltip title={params.value}>
              <span>{params.value}</span>
            </Tooltip>
          ),
        })
      );
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
                sx={{
                  color: "#102067",
                }}
              >
                <VisibilityIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(params.data._id)}
                sx={{
                  color: "#5d0d0d",
                }}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </Tooltip>
          </Stack>
        ),
        width: 150,
        pinned: "right",
        suppressSizeToFit: true,
      },
    ];
  }, [filteredData, navigate]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.showLoadingOverlay();
  };

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
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0e366e" }}>
          Electric Car Dashboard
        </Typography>
        {/* FILTER UI */}
        <TextField
          label="Search by Brand or Model"
          fullWidth
          size="small"
          sx={{ mb: 3 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            sx={{ backgroundColor: "#0e366e", minWidth: 100 }}
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
              gridApi?.hideOverlay();
            }}
          >
            Reset
          </Button>
        </Stack>
        {/* AG Grid */}
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Box
            className="ag-theme-alpine"
            sx={{
              height: 500,
              width: "100%",
              fontFamily: `"Roboto", "Helvetica Neue", "Arial", sans-serif`,
              fontSize: "13px",
              borderRadius: 2,
              position: "relative",
              "& .ag-header-cell": {
                overflow: "visible",
                paddingRight: "24px", // space for menu icon
              },
              "& .ag-header-cell-label": {
                display: "flex",
                alignItems: "center",
                gap: "4px",
                overflow: "visible",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
              "& .ag-header-cell .ag-header-cell-menu-button": {
                opacity: 1,
                visibility: "visible",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "16px",
                height: "16px",
                marginLeft: "4px",
              },
            }}
          >
            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 2,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CircularProgress
                  size={40}
                  thickness={4}
                  sx={{ color: "#1c69d4" }}
                />
              </Box>
            )}
            <AgGridReact
              ref={gridRef}
              onGridReady={onGridReady}
              rowData={filteredData}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
                tooltipComponent: "agTooltipComponent",
                menuTabs: [
                  "filterMenuTab",
                  "generalMenuTab",
                  "columnsMenuTab",
                ] as ColumnMenuTab[],
                suppressMovable: false,
              }}
              animateRows
              pagination
              paginationPageSize={10}
              suppressDragLeaveHidesColumns
              suppressMenuHide={true} // ← ensures legacy menu icon always visible
              columnMenu="legacy" // ← use legacy tabbed menu
              domLayout="normal"
              overlayNoRowsTemplate={
                isLoading ? "<span></span>" : "<span>No data available.</span>"
              }
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
