import { jwtDecode } from "jwt-decode";
import { axiosClient } from "../utils/axiosClient";
import { useInactivity } from "../hooks/useInactivity";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const StateContext = createContext({
  courses: [],
  setCourses: () => {},
  token: null,
  user: {
    id: null,
    name: null,
    email: null,
    role: null,
  },
  setToken: () => {},
  logout: () => {},
});

const getToken = () => localStorage.getItem("token") || null;

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

const StateProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [courses, setCourses] = useState(JSON.parse(localStorage.getItem("courses")) || []);
  const [user, setUser] = useState(null);
  const isInactive = useInactivity();

  const init = useCallback(async () => {
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded) {
      logout();
      return;
    }

    setUser({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    });

    try {
      const { data } = await axiosClient.get("/verify");
      if (!data.success) {
        logout();
      }
    } catch {
      logout();
    }
  }, [token]);

  const refreshToken = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    const decoded = decodeToken(token);
    const now = Date.now() / 1000;
    const refreshThreshold = 90;

    if (now > decoded.exp - refreshThreshold) {
      try {
        const { data } = await axiosClient.get("/refresh");
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        init();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [init]);

  useEffect(() => {
    if (isInactive && token) {
      logout();
    }
  }, [isInactive, token]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshToken();
    }, 60000 * 3); // Refresh token every 3 minutes

    return () => clearInterval(intervalId);
  }, [refreshToken]);

  const logout = useCallback(() => {
    axiosClient.get("/logout")
      .then(() => {
        setToken(null);
        setUser({});
        localStorage.clear();
      })
      .catch((err) => console.error("Logout error:", err)).finally(() => {
        window.location.href = "/login";
      })
  }, []);

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        logout,
        setToken,
        courses,
        setCourses,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

const useStateContext = () => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }

  return context;
};

export { StateProvider, useStateContext };
