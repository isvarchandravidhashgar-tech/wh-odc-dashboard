"use client";

import { readExcel } from "@/lib/excelReader";
import { useRef, useState } from "react";

type Props = {
  title: string;
  buttonText: string;
  color: string;
  fileType: "base" | "mapping" | "manifest";
  onFileLoaded: (fileType: string, data: any[], fileName: string) => void;
};

export default function UploadCard({
  title,
  buttonText,
  color,
  fileType,
  onFileLoaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("No file selected");

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-bold text-lg mb-3">{title}</h2>

      <button
        className={`w-full py-3 rounded-lg text-white ${color}`}
        onClick={() => inputRef.current?.click()}
      >
        {buttonText}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        hidden
        onChange={async (e) => {
  if (!e.target.files?.length) return;

  const file = e.target.files[0];

  console.log("Selected File =", file.name);
console.log("File Type =", fileType);

  setFileName(file.name);

  const data = await readExcel(file);

  console.log("File :", file.name);
  onFileLoaded(fileType, data, file.name);
  console.log("Rows :", data.length);
 if (data.length > 0) {
  console.log("Columns :", Object.keys(data[0]).length);
} else {
  console.log("No data found in file");
}

  console.log(data);
}}
      />

      <p className="text-sm text-gray-500 mt-3 break-all">
        {fileName}
      </p>
    </div>
  );
}