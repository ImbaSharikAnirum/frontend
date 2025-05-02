import { Paper } from "@mui/material";
import React from "react";

const StatisticsBlock = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "300px",
        height: "100%",
        overflow: "auto",
      }}
    >
      Статистика
    </Paper>
  );
};

export default StatisticsBlock;
