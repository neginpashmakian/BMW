import {
  Box,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function Footer() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        px: 2,
        textAlign: "center",
        backgroundColor: isDark ? "#27304a" : "#f4f4f4",
        color: isDark ? theme.palette.text.primary : "inherit",
        borderTop: `1px solid ${isDark ? "#444c5e" : "#ccc"}`,
      }}
    >
      <Typography variant="subtitle1" color="text.primary">
        Negin Pashmakian – Frontend Developer
      </Typography>

      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
        mt={1}
        flexWrap="wrap"
        useFlexGap
      >
        <Link
          href="mailto:neginpashmakian6@gmail.com"
          underline="hover"
          color="inherit"
        >
          neginpashmakian6@gmail.com
        </Link>
        <Typography color="text.secondary">|</Typography>
        <Typography color="text.secondary">+49 1575 4153333</Typography>
        <Typography color="text.secondary">|</Typography>
        <Typography color="text.secondary">Passau, Germany</Typography>
        <Typography color="text.secondary">|</Typography>
        <Link
          href="https://www.linkedin.com/in/negin-pashmakian/"
          target="_blank"
          underline="hover"
          color="inherit"
        >
          LinkedIn
        </Link>
      </Stack>

      {/* <Typography
        variant="caption"
        color="text.secondary"
        mt={1}
        display="block"
      >
        © {new Date().getFullYear()} Negin Pashmakian. All rights reserved.
      </Typography> */}
    </Box>
  );
}
