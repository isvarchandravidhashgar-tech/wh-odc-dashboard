"use client";

import { createContext, useContext, useState } from "react";

type FileData = any[];

type ContextType = {
  baseData: FileData;
  setBaseData: (data: FileData) => void;

  mappingData: FileData;
  setMappingData: (data: FileData) => void;

  manifestData: FileData;
  setManifestData: (data: FileData) => void;
};

const FileContext = createContext<ContextType | null>(null);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [baseData, setBaseData] = useState<any[]>([]);
  const [mappingData, setMappingData] = useState<any[]>([]);
  const [manifestData, setManifestData] = useState<any[]>([]);

  return (
    <FileContext.Provider
      value={{
        baseData,
        setBaseData,
        mappingData,
        setMappingData,
        manifestData,
        setManifestData,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FileContext);

  if (!context) {
    throw new Error("useFiles must be used inside FileProvider");
  }

  return context;
}