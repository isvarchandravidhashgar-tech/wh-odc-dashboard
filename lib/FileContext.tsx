"use client";

import { createContext, useContext, useState } from "react";
import { UploadedFile } from "@/types/fileTypes";

type ContextType = {
  baseFile?: UploadedFile;
  mappingFile?: UploadedFile;
  manifestFile?: UploadedFile;

  setBaseFile: (f: UploadedFile) => void;
  setMappingFile: (f: UploadedFile) => void;
  setManifestFile: (f: UploadedFile) => void;
};

const FileContext = createContext<ContextType | null>(null);

export function FileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [baseFile, setBaseFile] = useState<UploadedFile>();
  const [mappingFile, setMappingFile] = useState<UploadedFile>();
  const [manifestFile, setManifestFile] = useState<UploadedFile>();

  return (
    <FileContext.Provider
      value={{
        baseFile,
        mappingFile,
        manifestFile,
        setBaseFile,
        setMappingFile,
        setManifestFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const ctx = useContext(FileContext);

  if (!ctx) {
    throw new Error("useFiles must be used inside FileProvider");
  }

  return ctx;
}