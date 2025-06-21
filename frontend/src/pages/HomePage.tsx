import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import DataGridTable from "../components/DataGridTable";

export default function HomePage() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/data"); // ✅ correct backend URL
        setCars(res.data); // ✅ state set here
      } catch (err) {
        console.error("Failed to fetch cars", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <DataGridTable cars={cars} /> {/* ✅ pass data to table */}
    </Container>
  );
}
