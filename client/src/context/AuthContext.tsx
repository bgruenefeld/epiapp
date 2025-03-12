import { createContext, useState, useEffect, useContext } from "react";

const API_URL = "http://localhost:5000";

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  // **Benutzer aus LocalStorage laden**
  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("useEffect triggered - Checking token:", token);

    if (token) {
      console.log("Setting user to test because token exists");
      setUser("test"); 
    } else {
      console.log("Setting user to null because token is missing");
      setUser(null);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login fehlgeschlagen");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setUser(username);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    debugger
    console.log("Logging out...");
    localStorage.removeItem("token");

    // **Callback-Funktion sorgt für sofortige korrekte Aktualisierung**
    setUser(() => {
      console.log("User should now be null");
      return null;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
