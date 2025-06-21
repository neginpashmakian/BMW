// components/Header.tsx
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function Header() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1c1c1c", mb: 4 }}>
      <Toolbar
        sx={{
          flexDirection: isSmall ? "column" : "row",
          alignItems: isSmall ? "flex-start" : "center",
          gap: isSmall ? 1 : 0,
        }}
      >
        <Box
          component="img"
          src="/BMW_logo.svg"
          alt="BMW Logo"
          sx={{
            width: 40,
            height: 40,
            mr: isSmall ? 0 : 2,
            borderRadius: "50%",
            backgroundColor: "#fff",
            p: 0.5,
          }}
        />
        <Typography variant="h6" component="div">
          Electric Car Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
