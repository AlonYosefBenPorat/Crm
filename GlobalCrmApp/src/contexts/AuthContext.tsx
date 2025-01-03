import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  profileImage: {
    alt: string;
    src: string;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  token: string;
  role: string;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const initialValues: AuthContextType = {
  isLoggedIn: false,
  token: "",
  role: "",
  
  login: async (token: string) => {},
  logout: () => {}
};

const AuthContext = createContext<AuthContextType>(initialValues);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('JwtToken');
    
    if (storedToken) {
      const parsedToken = JSON.parse(storedToken);
      setToken(parsedToken.token);
      setRole(parsedToken.role);
      setIsLoggedIn(true);
    }
  }, []);

  

  const login = async (token: string) => {
    const decodedToken: any = jwtDecode(token);
    setIsLoggedIn(true);
    setToken(token);
    setRole(decodedToken.role); 
   localStorage.setItem('JwtToken', JSON.stringify({ token, role: decodedToken.role }));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken("");
    setUser(null);
    localStorage.clear();
    navigate('/landing-page');
   
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token,role,  login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
