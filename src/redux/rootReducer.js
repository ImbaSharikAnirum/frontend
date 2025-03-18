import { combineReducers } from "redux"; // Не нужен здесь
import authReducer from "./reducers/authReducer";
import courseReducer from "./reducers/courseReducer";
import studentReducer from "./reducers/studentReducer";
import invoiceReducer from "./reducers/invoiceSlice";
import invoiceBookingReducer from "./reducers/invoiceBookingReducer";
import activityReducer from "./reducers/activityReducer";
import courseTableReducer from "./reducers/courseTableReducer";
import monthReducer from "./reducers/monthReducer";
import modalReducer from "./reducers/modalReducer";
import creationReducer from "./reducers/creationReducer";
import pinterestReducer from "./reducers/pinterestReducer";
import userProfileReducer from "./reducers/userProfileReducer";
import portfolioReducer from "./reducers/portfolioReducer";
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
  invoiceBooking: invoiceBookingReducer,
  courseTable: courseTableReducer,
  activity: activityReducer,
  modals: modalReducer,
  monthCalculation: monthReducer,
  pinterest: pinterestReducer,
  userProfile: userProfileReducer,
  creation: creationReducer,
  portfolio: portfolioReducer,
});

export default rootReducer; // Не нужно экспортировать, если используете configureStore
