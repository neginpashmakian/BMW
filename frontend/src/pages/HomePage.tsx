import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import DataGridTable from "../components/DataGridTable";

// Add toggleTheme prop to the component
export default function HomePage({ toggleTheme }: { toggleTheme: () => void }) {
  const [cars, setCars] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5050/data");
        setCars(res.data);
      } catch (err) {
        console.error("Failed to fetch cars", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Container sx={{ mt: 5 }} maxWidth={false}>
      <DataGridTable cars={cars} />
    </Container>
  );
}
