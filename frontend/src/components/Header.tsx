// components/Header.tsx
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1c1c1c", mb: 4 }}>
      <Toolbar>
        {/* BMW Logo */}
        <Box
          component="img"
          src="/BMW_logo.svg"
          alt="BMW Logo"
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            borderRadius: "50%",
            backgroundColor: "#fff",
            p: 0.5,
          }}
        />

        {/* Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Electric Car Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
