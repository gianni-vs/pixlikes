import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

const AUTH_HOST = process.env.API_HOST || "http://localhost:8081";

const client = axios.create({
  baseURL: AUTH_HOST,
});

const defaultAuthData = {
  user: {
    id: 0,
    name: "Guest",
    email: "",
  },
  token: "",
  loading: false,
  error: null,
};

export const AuthContext = createContext(defaultAuthData);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultAuthData.user);
  const [, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const setResponseError = (e) => {
    if (e.response && e.response.data) {
      e.message = e.response.data;
    }
    setError(e);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    try {
      const decoded = jwt_decode(storedToken);
      setUser({
        id: Number(decoded.sub),
        email: decoded.email,
        name: localStorage.getItem("userName"),
      });
    } catch (e) {}
    setLoadingInitial(false);
  }, []);

  // reset the error state when changing page
  useEffect(() => {
    if (error) setError(null);
    // eslint-disable-next-line
  }, [location.pathname]);

  const authSuccess = (response) => {
    setUser({
      id: Number(response.data.user.id),
      name: response.data.user.name,
      email: response.data.user.email,
    });
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("userName", response.data.user.name);
    setToken(response.data.accessToken);
    navigate("/");
  };

  const signup = (name, email, password) => {
    setLoading(true);
    const data = { name: name, email: email, password: password };
    client
      .post("signup", data, {
        baseURL: AUTH_HOST,
        crossDomain: true,
      })
      .then((response) => authSuccess(response))
      .catch((err) => {
        setResponseError(err);
      })
      .finally(() => setLoading(false));
  };

  const login = (email, password) => {
    setLoading(true);
    const data = { email: email, password: password };
    client
      .post("login", data, {
        baseURL: AUTH_HOST,
        crossDomain: true,
      })
      .then((response) => authSuccess(response))
      .catch((err) => {
        setResponseError(err);
      })
      .finally(() => setLoading(false));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUser(defaultAuthData.user);
    navigate("/login");
  };

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      signup,
      login,
      logout,
    }),
    // eslint-disable-next-line
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export const Logout = () => {
  const { logout } = useAuth();
  logout();
};

export default function useAuth() {
  return useContext(AuthContext);
}
