import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function Header({ toggleTheme }: { toggleTheme: () => void }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="static"
      sx={{
        mb: 4,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "#0a192f" // 🎨 your custom dark mode header color
            : theme.palette.primary.main, // 💡 default light mode color
      }}
    >
      <Toolbar
        sx={{
          flexDirection: isSmall ? "column" : "row",
          alignItems: isSmall ? "flex-start" : "center",
          gap: isSmall ? 1 : 0,
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center">
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
          <Typography variant="h6" component="div">
            Electric Car Dashboard
          </Typography>
        </Box>
        <IconButton onClick={toggleTheme} color="inherit">
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
