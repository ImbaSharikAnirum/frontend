import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInitialized, setUser } from "../redux/reducers/authReducer";

export const useInitializeUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      dispatch(setUser({ jwt: token, user: JSON.parse(user) }));
    } else {
      dispatch(setInitialized()); // Устанавливаем флаг инициализации, если пользователь не найден
    }
  }, [dispatch]);
};
