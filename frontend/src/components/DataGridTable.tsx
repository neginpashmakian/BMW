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
  useTheme,
} from "@mui/material";
import type { ColumnMenuTab } from "ag-grid-community";
import {
  ClientSideRowModelModule,
  ColDef,
  CsvExportModule,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  PaginationModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  PaginationModule,
]);

export default function DataGridTable({ cars }: { cars: any[] }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [baseData, setBaseData] = useState<any[]>(cars);
  const [filteredData, setFilteredData] = useState<any[]>(cars);
  const [searchTerm, setSearchTerm] = useState("");
  const [field, setField] = useState("Brand");
  const [operator, setOperator] = useState("contains");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBaseData(cars);
    setFilteredData(cars);
  }, [cars]);
  const fieldMap: Record<string, string> = {
    Brand: "Brand",
    Model: "Model",
    Range_km: "Range_Km",
    PowerTrain: "Power_Train",
    Range_Km: "Range_Km",
    Efficiency_WhKm: "Efficiency_WhKm",
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

  const hideOverlay = useCallback(() => {
    setIsLoading(false);
    gridApi?.hideOverlay();
  }, [gridApi]);
  // Search logic applies on baseData
  useEffect(() => {
    if (!gridApi) return;
    showLoading();
    const timeout = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      const result = searchTerm
        ? baseData.filter(
            (car) =>
              car.Brand?.toLowerCase().includes(lower) ||
              car.Model?.toLowerCase().includes(lower)
          )
        : baseData;
      setFilteredData(result);
      hideOverlay();
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, baseData, gridApi, hideOverlay]);

  // Backend filter updates baseData
  const handleBackendFilter = async () => {
    if (!gridApi) return;
    showLoading();
    try {
      const resp = await fetch("http://127.0.0.1:5050/data/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: fieldMap[field], operator, value }),
      });
      const data = await resp.json();
      setBaseData(data); // now search runs on this
    } catch (err) {
      console.error(err);
    } finally {
      hideOverlay();
    }
  };

  const handleDelete = (id: string) => {
    setFilteredData((prev) => prev.filter((row) => row._id !== id));
    setBaseData((prev) => prev.filter((row) => row._id !== id));
  };

  const updatePagination = () => {
    if (!gridRef.current?.api) return;
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
          suppressMovable: false,
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
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        width: 60,
        cellClass: "row-number-cell",
        suppressMovable: true,
        sortable: false,
        filter: false,
        pinned: "left",
      },
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
                sx={{ color: "#1f415d" }}
              >
                <VisibilityIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(params.data._id)}
                sx={{ color: "#7b2b29" }}
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
      sx={{ width: "100%", display: "flex", justifyContent: "center", px: 2 }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          px: 4,
          py: 4,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", paddingBottom: 2 }}>
          Electric Car Dashboard
        </Typography>

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
          <Button
            variant="contained"
            sx={{
              minWidth: 100,
              backgroundColor:
                theme.palette.mode === "dark" ? "#264B8C" : "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#1e3a6b" : "#1565c0",
              },
            }}
            onClick={handleBackendFilter}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ minWidth: 100 }}
            onClick={() => {
              setBaseData(cars);
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
          <Button
            variant="outlined"
            color="success"
            sx={{ minWidth: 100, marginLeft: "auto" }}
            onClick={() => {
              if (gridApi) {
                gridApi.exportDataAsCsv({ fileName: "electric_cars.csv" });
              }
            }}
          >
            Export CSV
          </Button>
        </Stack>

        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Box
            className="ag-theme-alpine"
            sx={{
              height: "100%",
              width: "100%",
              fontFamily: '"Roboto", "Helvetica Neue", "Arial", sans-serif',
              fontSize: "13px",
              borderRadius: 2,
              ...(theme.palette.mode === "dark"
                ? {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.default,
                    "& .ag-header": {
                      backgroundColor: theme.palette.background.paper,
                    },
                    "& .ag-header-cell": {
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                    },
                    "& .ag-cell, & .ag-header-cell-label, & .ag-header-cell": {
                      color: "#fff",
                    },
                    "& .ag-row": {
                      backgroundColor: "#5a6e92",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    },
                    "& .ag-row-hover": {
                      backgroundColor: "#475980 !important",
                    },
                  }
                : {
                    "& .ag-cell, & .ag-header-cell-label, & .ag-header-cell": {
                      color: "#4d4d4d",
                      fontSize: "15px",
                    },
                    "& .ag-row-hover": {
                      backgroundColor: "#f5f5f5 !important",
                    },
                  }),
            }}
          >
            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 2,
                  top: "80%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CircularProgress
                  size={40}
                  thickness={4}
                  sx={{ color: "#90caf9" }}
                />
              </Box>
            )}
            <AgGridReact
              ref={gridRef}
              onGridReady={onGridReady}
              domLayout="autoHeight"
              onFirstDataRendered={updatePagination}
              onPaginationChanged={updatePagination}
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
              paginationPageSize={20}
              suppressDragLeaveHidesColumns
              columnMenu="legacy"
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
