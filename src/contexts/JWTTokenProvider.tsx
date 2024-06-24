import React, { createContext, useState, ReactNode } from "react";

interface Presale {
  presaleKey: string;
  owner: string;
  base_mint: string;
  quote_mint: string;
  min_allocation: number;
  max_allocation: number;
  hardcap: number;
  softcap: number;
  sale_price: number;
  launch_price: number;
  start_time: number;
  end_time: number;
  total_contributions: number;
  max_contribution: number;
}

interface JwtTokenContextProps {
  jwtToken: string | null;
  setJwtToken: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  userId: number | null;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  presales: Presale[];
  setPresales: React.Dispatch<React.SetStateAction<Presale[]>>;
}

// This is just an initial placeholder value
export const JwtTokenContext = createContext<JwtTokenContextProps>({
  jwtToken: null,
  setJwtToken: () => null,
  userRole: null,
  setUserRole: () => null,
  userId: null,
  setUserId: () => null,
  presales: [],
  setPresales: () => [],
});

interface JwtTokenProviderProps {
  children: ReactNode;
}

export const JwtTokenProvider: React.FC<JwtTokenProviderProps> = ({ children }) => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [presales, setPresales] = useState<Presale[]>([]);

  return (
    <JwtTokenContext.Provider value={{ jwtToken, setJwtToken, userRole, setUserRole, userId, setUserId, presales, setPresales }}>
      {children}
    </JwtTokenContext.Provider>
  );
};