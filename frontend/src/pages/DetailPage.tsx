import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import DetailView from "../components/DetailView";

export default function DetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5050/data/${id}`).then((res) => {
      setCar(res.data);
    });
  }, [id]);

  if (!car) return <p>Loading...</p>;

  return <DetailView car={car} />;
}
