import { combineReducers } from "redux";

import { reducer as searchReducer } from "./SearchContacts";
import { reducer as contactDetailsReducer } from "./ContactDetails";

// exp: bind reducer
export default combineReducers({
  search: searchReducer,
  contactDetails: contactDetailsReducer
});
