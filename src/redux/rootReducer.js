import { combineReducers } from "redux"; // Не нужен здесь
import authReducer from "./reducers/authReducer";
import courseReducer from "./reducers/courseReducer";
import filterReducer from "./filterSlice";
import coursesReducer from "./coursesSlice";
import coursesCountReducer from "./coursesCountSlice";
import filterForCountReducer from "./filterForCountSlice";
import footerMenuReducer from "./footerMenuSlice";

// Прямое использование configureStore не требует явного использования combineReducers
const rootReducer = combineReducers({
  auth: authReducer,
  filter: filterReducer,
  courses: coursesReducer,
  coursesCount: coursesCountReducer,
  filterForCount: filterForCountReducer,
  footerMenu: footerMenuReducer,
  course: courseReducer,
});

export default rootReducer; // Не нужно экспортировать, если используете configureStore
