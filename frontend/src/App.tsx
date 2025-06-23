// App.tsx
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import DetailPage from "./pages/DetailPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#151525",
                  paper: "#364566",
                },
              }
            : {
                background: {
                  default: "#fefefe",
                  paper: "#fff",
                },
              }),
        },
        typography: {
          fontFamily: `"Roboto", "Helvetica Neue", "Arial", sans-serif`,
        },
      }),
    [mode]
  );

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          display="flex"
          flexDirection="column"
          minHeight="100vh"
          bgcolor="background.default"
        >
          <Header toggleTheme={toggleTheme} />

          <Box component="main" flexGrow={1} py={4}>
            <Routes>
              <Route
                path="/"
                element={<HomePage toggleTheme={toggleTheme} />}
              />
              <Route path="/detail/:id" element={<DetailPage />} />
            </Routes>
          </Box>

          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}
