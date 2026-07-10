"use client";

import { useState } from "react";
import UploadCard from "@/components/UploadCard";
import { createWorkingFile } from "@/lib/createWorkingFile";
import { downloadCSV } from "@/lib/downloadCSV";

export default function Home() {
  const [baseData, setBaseData] = useState<any[]>([]);
  const [mappingData, setMappingData] = useState<any[]>([]);
  const [manifestData, setManifestData] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);

  const handleFileLoaded = (
    fileType: string,
    data: any[],
    fileName: string
  ) => {
    console.log("===========");
  console.log(fileType);
  console.log(data.length);
    console.log(fileType, fileName, data.length);

    if (fileType === "base") {
      setBaseData(data);
    }

    if (fileType === "mapping") {
      setMappingData(data);
    }

    if (fileType === "manifest") {
      setManifestData(data);
    }
  };

  const generateDashboard = () => {
  if (
    baseData.length === 0 ||
    mappingData.length === 0 ||
    manifestData.length === 0
  ) {
    alert("Please upload all three files.");
    return;
  }

  const workingData = createWorkingFile(
    baseData,
    mappingData,
    manifestData
  );

  downloadCSV(workingData, "Working_File.csv");

  alert("Working File Generated Successfully.");
};

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-emerald-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold">
            SHADOWFAX WH ODC Dashboard
          </h1>

          <p className="text-emerald-100 mt-1">
            Warehouse Operations Dashboard
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UploadCard
            title="📂 Base File"
            buttonText="Upload Base File"
            color="bg-emerald-600 hover:bg-emerald-700"
            fileType="base"
            onFileLoaded={handleFileLoaded}
          />

          <UploadCard
            title="📂 Mapping File"
            buttonText="Upload Mapping"
            color="bg-blue-600 hover:bg-blue-700"
            fileType="mapping"
            onFileLoaded={handleFileLoaded}
          />

          <UploadCard
            title="📂 Manifest File"
            buttonText="Upload Manifest"
            color="bg-orange-500 hover:bg-orange-600"
            fileType="manifest"
            onFileLoaded={handleFileLoaded}
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={generateDashboard}
            className="bg-black text-white px-8 py-4 rounded-xl text-lg hover:bg-gray-800"
          >
            Generate Dashboard
          </button>
        </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-gray-500">Base Rows</h2>
    <p className="text-3xl font-bold">{baseData.length}</p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-gray-500">Mapping Rows</h2>
    <p className="text-3xl font-bold">{mappingData.length}</p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-gray-500">Manifest Rows</h2>
    <p className="text-3xl font-bold">{manifestData.length}</p>
  </div>
</div>
      </section>
    </main>
  );
}