import React from "react";
import MintNFT from "./components/MintNFT";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MintNFT />
    </ThemeProvider>
  );
}

export default App;
