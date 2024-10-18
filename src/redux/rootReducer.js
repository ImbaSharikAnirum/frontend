import { combineReducers } from "redux"; // Не нужен здесь
import authReducer from "./reducers/authReducer";
import courseReducer from "./reducers/courseReducer";
import studentReducer from "./reducers/studentReducer";
import invoiceReducer from "./reducers/invoiceReducer";
import activityReducer from "./reducers/activityReducer";
import courseTableReducer from "./reducers/courseTableReducer";
import modalReducer from "./reducers/modalReducer";
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
  student: studentReducer,
  invoice: invoiceReducer,
  courseTable: courseTableReducer,
  activity: activityReducer,
  modals: modalReducer,
});

export default rootReducer; // Не нужно экспортировать, если используете configureStore
