import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function DetailView({ car }: { car: any }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom color="primary">
          {car.Brand} – {car.Model}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          {Object.entries(car).map(([key, value]) =>
            key === "_id" || key === "__v" ? null : (
              <Box key={key} sx={{ width: "48%" }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>{key}</strong>: {String(value)}
                </Typography>
              </Box>
            )
          )}
        </Box>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </CardContent>
    </Card>
  );
}
