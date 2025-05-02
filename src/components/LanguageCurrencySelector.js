import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useTranslation, i18n } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setCurrency } from "../redux/reducers/currencyReducer";
import {
  setLanguage,
  setAutoTranslate,
  setTargetLanguage,
  selectLanguageCode,
} from "../redux/reducers/languageReducer";
import { LANGUAGE_MAP, CURRENCIES } from "../utils/constants";
import { selectCurrency } from "../redux/reducers/currencyReducer";
import TranslateIcon from "@mui/icons-material/Translate";
import { styled } from "@mui/material/styles";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const StyledListItemButton = styled("div")(({ theme, selected }) => ({
  cursor: "pointer",
  padding: "8px",
  borderRadius: "4px",
  border: selected ? "1px solid black" : "none",
  backgroundColor: selected ? "rgba(0, 0, 0, 0.04)" : "transparent",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    padding: 16,
    minHeight: "500px",
    maxHeight: "500px",
    display: "flex",
    flexDirection: "column",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  padding: "16px 0",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "2px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "2px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
}));

const LanguageCurrencySelector = ({
  open,
  onClose,
  selectedCurrency: propSelectedCurrency,
  defaultTab = 0,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  // Получаем текущий язык и валюту из Redux
  const currentLanguage = useSelector(selectLanguageCode);
  const currentCurrency = useSelector(selectCurrency);
  const isAutoTranslate = useSelector(
    (state) => state.language.isAutoTranslate
  );
  const targetLanguage = useSelector((state) => state.language.targetLanguage);

  const [selectedTab, setSelectedTab] = React.useState(defaultTab);
  const [localSelectedCurrency, setLocalSelectedCurrency] =
    React.useState(currentCurrency);

  React.useEffect(() => {
    setLocalSelectedCurrency(currentCurrency);
  }, [currentCurrency]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      onClose();
    }
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    dispatch(setLanguage(newLanguage));
    i18n.changeLanguage(newLanguage);
    onClose();
  };

  const handleAutoTranslateChange = (event) => {
    dispatch(setAutoTranslate(event.target.checked));
  };

  const handleTargetLanguageChange = (event) => {
    dispatch(setTargetLanguage(event.target.value));
  };

  const handleCurrencySelect = async (currency) => {
    dispatch(setCurrency(currency));
    setLocalSelectedCurrency(currency);
    onClose();
  };

  const getCurrencyLabel = (code) => {
    return CURRENCIES[code]?.symbol || "";
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        textColor="inherit"
        indicatorColor="primary"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 1,
        }}
      >
        <Tab label={t("languageAndRegion")} />
        <Tab label={t("currency")} />
      </Tabs>

      <StyledDialogContent>
        {selectedTab === 0 && (
          <Box sx={{ height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              {t("translation")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
              }}
            >
              <TranslateIcon sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {t("autoTranslate", {
                  language: currentLanguage.name,
                })}
              </Typography>
              <FormControlLabel
                control={<IOSSwitch defaultChecked />}
                label=""
              />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              {t("recommendedLanguages")}
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(LANGUAGE_MAP).map(([code, name]) => (
                <Grid item xs={6} md={3} key={code}>
                  <StyledListItemButton
                    selected={currentLanguage === code}
                    onClick={() =>
                      handleLanguageChange({ target: { value: code } })
                    }
                  >
                    <Typography variant="body2">{name}</Typography>
                  </StyledListItemButton>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box sx={{ height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              {t("selectCurrency")}
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(CURRENCIES).map(([code, currency]) => (
                <Grid item xs={6} md={3} key={code}>
                  <StyledListItemButton
                    selected={localSelectedCurrency?.code === code}
                    onClick={() =>
                      handleCurrencySelect({
                        code: code,
                        symbol: currency.symbol,
                        name: currency.name,
                      })
                    }
                  >
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {currency.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {code} – {currency.symbol}
                    </Typography>
                  </StyledListItemButton>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default LanguageCurrencySelector;
