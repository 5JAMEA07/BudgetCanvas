// AuthContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth as useClerkAuth } from '@clerk/nextjs';

interface AuthContextProps {
  isAuthenticated: boolean;
  userId: string | null;
  accessToken: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  fetchBudgetData: () => Promise<void>;
  setAccessToken: (accessToken: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isSignedIn, userId } = useClerkAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(!!isSignedIn);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const fetchBudgetData = async () => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
    try {
      const response = await fetch(`/api/budget-data?userId=${userId}`);
      const data = await response.json();
      // Handle the fetched budget data (e.g., update state or context)
      console.log("Fetched budget data:", data.budgetData);
    } catch (error) {
      console.error("Error fetching budget data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId: userId || null, accessToken, setIsAuthenticated, fetchBudgetData, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};