import React from "react";
import Box from "@mui/material/Box";

const Logo = ({ width = 150 }) => {
  return (
    <Box component="img" src="/LogoImage.png" alt="LocalShop Logo" width={width} />
  );
};

export default Logo;
