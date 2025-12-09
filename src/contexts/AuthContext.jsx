import { createContext, useState, useEffect } from "react";
import { getUserLogged, refreshTokenRequest } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      let activeToken = token;
    
      if (!activeToken) {
        const newToken = await refreshToken();
        if (!newToken) { 
          setIsLoading(false);
          return;
        }
        activeToken = newToken;
      }      
      
      const { error, data } = await getUserLogged(activeToken);
      
      if (!error) {
        setUser(data.user);
        
      } else {
        console.log("Access token expired, trying refresh...");
        const newToken = await refreshToken();
    
        if (newToken) {
          const { error: retryError, data: retryData } = await getUserLogged(newToken);
          if (!retryError) setUser(retryData.user);
        }
      }
    
      setIsLoading(false);
    }
    checkAuth();
  }, [token]);

  const loginUser = async (token) => {
    setToken(token);
    const { data } = await getUserLogged(token);
    setUser(data.user);
  };

  const refreshToken = async () => {
    const newToken = await refreshTokenRequest();
    if (newToken) {
      setToken(newToken);
      return newToken;
    };
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, isLoading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;