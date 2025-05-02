import { IconButton, Tooltip, Box } from "@mui/material";
import React, { useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import GroupsBlock from "./GroupsBlock";
import AIAssistantBlock from "./AIAssistantBlock";
import LibraryBlock from "./LibraryBlock";
import StatisticsBlock from "./StatisticsBlock";

// Конфиг
const COMPONENTS_MAP = {
  groups: { icon: <GroupsIcon />, label: "Группы", component: <GroupsBlock /> },
  ai: {
    icon: <SmartToyIcon />,
    label: "AI Ассистент",
    component: <AIAssistantBlock />,
  },
  library: {
    icon: <LibraryBooksIcon />,
    label: "Библиотека",
    component: <LibraryBlock />,
  },
  statistics: {
    icon: <AnalyticsIcon />,
    label: "Статистика",
    component: <StatisticsBlock />,
  },
};

export default function SideToolsPanel() {
  // Стартовые блоки
  const [leftBlock, setLeftBlock] = useState("groups");
  const [rightBlock, setRightBlock] = useState("ai");

  const isActive = (key) => key === leftBlock || key === rightBlock;

  const handleIconClick = (key) => {
    if (key === leftBlock || key === rightBlock) return;

    // Заменяем самый старый (левый)
    setLeftBlock(rightBlock);
    setRightBlock(key);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={2}>
      <Box display="flex" gap={1} p={1}>
        {Object.entries(COMPONENTS_MAP).map(([key, { icon, label }]) => (
          <Tooltip key={key} title={label}>
            <IconButton
              sx={{
                color: isActive(key) ? "black" : "gray",
                "&:hover": { color: "black" },
              }}
              onClick={() => handleIconClick(key)}
            >
              {icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Box display="flex" gap={2} height="100%" minHeight={0}>
        {COMPONENTS_MAP[leftBlock].component}
        {COMPONENTS_MAP[rightBlock].component}
      </Box>
    </Box>
  );
}
