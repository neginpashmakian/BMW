import { Box, Button, Card, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export default function DetailView({ car }: { car: any }) {
  const navigate = useNavigate();

  const leftFields = [
    "AccelSec",
    "Range_Km",
    "FastCharge_KmH",
    "PowerTrain",
    "BodyStyle",
    "Seats",
    "Date",
  ];

  const rightFields = [
    "TopSpeed_KmH",
    "Efficiency_WhKm",
    "RapidCharge",
    "PlugType",
    "Segment",
    "PriceEuro",
  ];

  const formatLabel = (label: string) =>
    label
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b(KmH|WhKm|Km|Euro)\b/g, (match) =>
        match.replace(/([a-z])/, (m) => m.toUpperCase())
      )
      .trim();

  return (
    <Card
      sx={{
        maxWidth: 900,
        mx: "auto",
        my: 5,
        px: 4,
        py: 4,
        boxShadow: 5,
        borderRadius: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: "#1c69d4", fontWeight: "bold" }}
      >
        {car.Brand} – {car.Model}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          columnGap: 4,
          rowGap: 1.5,
        }}
      >
        <Box sx={{ flex: "1 1 300px" }}>
          {leftFields.map((key) => (
            <Typography key={key} variant="body1" sx={{ mb: 1, color: "#333" }}>
              <strong>{formatLabel(key)}:</strong>{" "}
              {car[key] !== undefined ? car[key] : "-"}
            </Typography>
          ))}
        </Box>

        <Box sx={{ flex: "1 1 300px" }}>
          {rightFields.map((key) => (
            <Typography key={key} variant="body1" sx={{ mb: 1, color: "#333" }}>
              <strong>{formatLabel(key)}:</strong>{" "}
              {car[key] !== undefined ? car[key] : "-"}
            </Typography>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box textAlign="center">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1c69d4",
            px: 5,
            py: 1,
            fontWeight: "bold",
            borderRadius: 2,
          }}
          onClick={() => navigate("/")}
        >
          BACK
        </Button>
      </Box>
    </Card>
  );
}
