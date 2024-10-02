import { createContext, useContext, useEffect, useState } from "react";

const PathContext = createContext<any>(null);
export const usePathContext = () =>
  useContext<{ defaultPath: string; setDefaultPath: (str: string) => void }>(
    PathContext
  );

export const PathProvider = ({ children }: { children: React.ReactNode }) => {
  const storedPath = localStorage.getItem("defaultPath");
  const [defaultPath, setDefaultPath] = useState(storedPath ?? "/");

  useEffect(() => {
    localStorage.setItem("defaultPath", defaultPath);
  }, [defaultPath]);

  return (
    <PathContext.Provider value={{ defaultPath, setDefaultPath }}>
      {children}
    </PathContext.Provider>
  );
};
