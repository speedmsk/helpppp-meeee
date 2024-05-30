import { SET_USER } from '../actions/userActions';
import store from '../main'
const initialState = {
  userData: null // Ensure this is set to a sensible default if needed
};


function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        userData: action.payload  // Ensure the payload is correctly used to update userData
      };
    default:
      return state;
  }

}
export default userReducer;
