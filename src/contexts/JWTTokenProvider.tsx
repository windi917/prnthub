import React, { createContext, useState, ReactNode } from "react";

interface JwtTokenContextProps {
  jwtToken: string | null;
  setJwtToken: React.Dispatch<React.SetStateAction<string | null>>;
}

// This is just an initial placeholder value
export const JwtTokenContext = createContext<JwtTokenContextProps>({
  jwtToken: null,
  setJwtToken: () => null,
});

interface JwtTokenProviderProps {
  children: ReactNode;
}

export const JwtTokenProvider: React.FC<JwtTokenProviderProps> = ({ children }) => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  return (
    <JwtTokenContext.Provider value={{ jwtToken, setJwtToken }}>
      {children}
    </JwtTokenContext.Provider>
  );
};