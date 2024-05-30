import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isPending, setIsPending] = useState(false);

  const login = async (email, password) => {
    let result = { message: "", status: false };
    try {
      setIsPending(true);
      const response = await axios({
        method: "POST",
        url: `https://localhost:7125/login`,
        data: { email, password },
      });
      const data = response.data;
      localStorage.setItem("user", JSON.stringify(data?.user));
      setUser(data?.user);
      result.message = "Logged in successfully";
      result.status = true;
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        if (data?.details) result.message = formatResponse(data.details);
        else result.message = data?.message;
      } else if (error.request) {
        result.message = "No response from server";
      } else {
        result.message = `Sorry, something went wrong: ${error.message}`;
      }
    } finally {
      setIsPending(false);
    }
    return result;
  };

  const register = async (username, email, password) => {
    let result = { message: "", status: false };
    try {
      setIsPending(true);
      const response = await axios({
        method: "POST",
        url: `https://localhost:7125/register`,
        data: { username, email, password },
      });
      result.message = "You are registered successfully";
      result.status = true;
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        if (data?.details) result.message = formatResponse(data.details);
        else result.message = data?.message;
      } else if (error.request) {
        result.message = "No response from server";
      } else {
        result.message = `Sorry, something went wrong: ${error.message}`;
      }
    } finally {
      setIsPending(false);
    }
    return result;
  };

  useEffect(() => {
    const isAuthenticated = () => {
      const result = localStorage.getItem("userData");
      if (!result) {
        setUser(null);
        return false;
      }
      return true;
    };
    isAuthenticated();
  }, [user]);

  const logout = async () => {
    localStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;

function formatResponse(details) {
  return details.flatMap((element) => element.message).join("\n");
}
