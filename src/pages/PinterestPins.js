import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  selectPinterestError,
  selectPinterestStatus,
  setError,
  setLoading,
  setPinterest,
} from "../redux/reducers/pinterestReducer";
import { useFetchPinsQuery } from "../redux/services/pinterestApi";

const PinterestPins = () => {
  const dispatch = useDispatch();

  // Используем хук для запроса пинов
  const { data: pins, error, isLoading, isSuccess } = useFetchPinsQuery();

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading());
    } else if (isSuccess && pins) {
      dispatch(setPinterest(pins));
    } else if (error) {
      dispatch(setError(error.message || "Error fetching pins"));
    }
  }, [isLoading, isSuccess, pins, error, dispatch]);

  // Селекторы для получения статуса и ошибки
  const status = selectPinterestStatus();
  const selectError = selectPinterestError();

  return (
    <div>
      <h1>Pinterest Pins</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {selectError}</p>}
      {status === "succeeded" && pins && (
        <div>
          <h2>Your Pinterest Pins</h2>
          <ul>
            {pins.map((pin) => (
              <li key={pin.id}>
                <img src={pin.imageUrl} alt={pin.title} width="100" />
                <p>{pin.title}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PinterestPins;
