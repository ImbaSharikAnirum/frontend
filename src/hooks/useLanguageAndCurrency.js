import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import i18n from "../i18n";
import {
  LANGUAGES,
  CURRENCIES,
  COUNTRY_TO_CURRENCY,
  COUNTRY_TO_LANGUAGE,
} from "../utils/constants";
import { setCurrency, selectCurrency } from "../redux/reducers/currencyReducer";

const useLanguageAndCurrency = () => {
  const dispatch = useDispatch();
  const selectedCurrency = useSelector(selectCurrency);

  // Состояние для языка
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || LANGUAGES.EN;
  });

  // Определение языка и валюты по IP
  useEffect(() => {
    const hasLocationBeenDetected = localStorage.getItem("locationDetected");
    const savedCurrency = localStorage.getItem("currency");

    // Если валюта уже сохранена, пропускаем определение по IP
    if (savedCurrency) {
      return;
    }

    const detectUserLocation = async () => {
      try {
        const response = await axios.get(
          "https://ipinfo.io/?token=7d28c90f4695cb"
        );
        const { country } = response.data;

        // Устанавливаем валюту на основе страны
        const currencyCode = COUNTRY_TO_CURRENCY[country] || "USD";
        const detectedCurrency = CURRENCIES[currencyCode];

        dispatch(setCurrency(detectedCurrency));

        // Устанавливаем язык на основе страны
        const detectedLanguage = COUNTRY_TO_LANGUAGE[country] || LANGUAGES.EN;
        if (!localStorage.getItem("language")) {
          setSelectedLanguage(detectedLanguage);
          localStorage.setItem("language", detectedLanguage);
          await i18n.changeLanguage(detectedLanguage);
        }

        localStorage.setItem("locationDetected", "true");
      } catch (error) {
        console.error("Ошибка при определении местоположения:", error);
        // В случае ошибки используем значения по умолчанию
        if (!savedCurrency) {
          dispatch(setCurrency(CURRENCIES.USD));
        }
        localStorage.setItem("locationDetected", "true");
      }
    };

    if (!hasLocationBeenDetected) {
      detectUserLocation();
    }
  }, [dispatch]);

  // Обработчик изменения языка
  const handleLanguageChange = async (languageCode) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem("language", languageCode);
    await i18n.changeLanguage(languageCode);
  };

  // Обработчик изменения валюты
  const handleCurrencyChange = (currency) => {
    dispatch(setCurrency(currency));
  };

  return {
    selectedLanguage,
    selectedCurrency,
    handleLanguageChange,
    handleCurrencyChange,
  };
};

export default useLanguageAndCurrency;
