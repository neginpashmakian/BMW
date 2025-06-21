import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

export default function DataGridTable({ cars }: { cars: any[] }) {
  const navigate = useNavigate();

  const columns = [
    { field: "Brand", headerName: "Brand", width: 150 },
    { field: "Model", headerName: "Model", width: 200 },
    { field: "Range_Km", headerName: "Range (km)", width: 120 },
    {
      field: "action",
      headerName: "Details",
      width: 120,
      renderCell: (params: any) => (
        <button onClick={() => navigate(`/detail/${params.row._id}`)}>
          View
        </button>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={cars.map((car) => ({ id: car._id, ...car }))}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10]}
      />
    </div>
  );
}
