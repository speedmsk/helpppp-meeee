import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/main';
import Cookies from 'js-cookie';
import { setUser } from './store/actions/userActions';
import AuthContextProvider from './utilities/useAuth';

const userDataFromCookie = Cookies.get('userData');
if (userDataFromCookie) {
  const userData = JSON.parse(userDataFromCookie);
  store.dispatch(setUser(userData));  // Dispatch an action to set user data in Redux
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthContextProvider>
  </React.StrictMode>
);
