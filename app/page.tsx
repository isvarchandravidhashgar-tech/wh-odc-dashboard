"use client";

import { useState, useEffect } from "react";
import UploadCard from "@/components/UploadCard";
import { createWorkingFile } from "@/lib/createWorkingFile";
import { downloadCSV } from "@/lib/downloadCSV";
import { processDashboard } from "@/lib/processDashboard";
import { createSummaryReport } from "@/lib/createSummaryReport";




export default function Home() {

const [baseData, setBaseData] = useState<any[]>([]);
const [mappingData, setMappingData] = useState<any[]>([]);
const [manifestData, setManifestData] = useState<any[]>([]);
const [dashboard, setDashboard] = useState<any>(null);
const [workingData, setWorkingData] = useState<any[]>([]);

const [selectedRemarks, setSelectedRemarks] = useState<string[]>([]);
const [selectedManifest, setSelectedManifest] = useState<string[]>([]);
const [selectedClient, setSelectedClient] = useState<string[]>([]);

const [summaryReport, setSummaryReport] = useState<any[]>([]);

const remarkOptions = [...new Set(workingData.map(row => row.Consol_Ops_Remarks).filter(Boolean))];

const manifestOptions = [...new Set(workingData.map(row => row.Manifested_ODC_1).filter(Boolean))];

const clientOptions = [...new Set(workingData.map(row => row.client).filter(Boolean))];

const handleFileLoaded = (
  fileType: string,
  data: any[],
  fileName: string
) => {

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



    const generatedData = createWorkingFile(
  baseData,
  mappingData,
  manifestData
);

setWorkingData(generatedData);



    const dashboardData = processDashboard(generatedData);


    setDashboard(dashboardData);
    const summary = createSummaryReport(
  generatedData,
  selectedRemarks,
  selectedManifest,
  selectedClient
);

setSummaryReport(summary);



    


    alert("Working File Generated Successfully.");

  };
const downloadWorkingFile = () => {

  if (workingData.length === 0) {
    alert("Please Generate Dashboard First");
    return;
  }

  downloadCSV(workingData, "WH_ODC_Working_File.csv");

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





     <div className="mt-8 flex justify-center gap-5">


<button

onClick={generateDashboard}

className="bg-black text-white px-8 py-4 rounded-xl text-lg hover:bg-gray-800"

>

🔄 Refresh Data

</button>



<button

onClick={downloadWorkingFile}

className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-green-700"

>

⬇ Download Data

</button>


</div>







        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">


          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-gray-500">
              Base Rows
            </h2>

            <p className="text-3xl font-bold">
              {baseData.length}
            </p>

          </div>





          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-gray-500">
              Mapping Rows
            </h2>

            <p className="text-3xl font-bold">
              {mappingData.length}
            </p>

          </div>





          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-gray-500">
              Manifest Rows
            </h2>

            <p className="text-3xl font-bold">
              {manifestData.length}
            </p>

          </div>



        </div>







        {dashboard && (

          <div className="mt-10">


            <h2 className="text-2xl font-bold mb-5">
              Dashboard Summary
            </h2>
            <div className="bg-white rounded-xl shadow p-6 mb-8">

  <h3 className="text-lg font-bold mb-5">
    Dashboard Summary
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

    <div>
      <label className="block text-sm font-medium mb-2">
        Remarks
      </label>

      <select
  className="w-full border rounded-lg p-2"
  value={selectedRemarks[0] || ""}
  onChange={(e) => {
    const value = e.target.value;

    const remarks = value ? [value] : [];

    setSelectedRemarks(remarks);

    setSummaryReport(
      createSummaryReport(
        workingData,
        remarks,
        selectedManifest,
        selectedClient
      )
    );
  }}
>
  <option value="">All Remarks</option>

  {remarkOptions.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
</select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Manifest
      </label>

      <select
  className="w-full border rounded-lg p-2"
  value={selectedManifest[0] || ""}
  onChange={(e) => {
    const value = e.target.value;

    const manifest = value ? [value] : [];

    setSelectedManifest(manifest);

    setSummaryReport(
      createSummaryReport(
        workingData,
        selectedRemarks,
        manifest,
        selectedClient
      )
    );
  }}
>
  <option value="">All Manifest</option>

  {manifestOptions.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
</select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Client
      </label>

      <select
  className="w-full border rounded-lg p-2"
  value={selectedClient[0] || ""}
  onChange={(e) => {
    const value = e.target.value;

    const client = value ? [value] : [];

    setSelectedClient(client);

    setSummaryReport(
      createSummaryReport(
        workingData,
        selectedRemarks,
        selectedManifest,
        client
      )
    );
  }}
>
  <option value="">All Client</option>

  {clientOptions.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
</select>
    </div>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full border text-sm">

      <thead className="bg-gray-100">

        <tr>
          <th className="border p-2">Lane</th>
          <th className="border p-2">Dock Cutoff</th>
          <th className="border p-2">Shipment</th>
          <th className="border p-2">% of Total</th>
        </tr>

      </thead>

      <tbody>

        {summaryReport.map((row, index) => (

          <tr key={index}>

            <td className="border p-2">{row.lane}</td>

            <td className="border p-2">{row.cutoff}</td>

            <td className="border p-2 text-center">
              {row.shipment}
            </td>

            <td className="border p-2 text-center">
              {row.percent}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>
            
<div className="bg-white rounded-lg shadow p-4 mb-8">

<div className="overflow-auto max-h-[450px]">

<table className="w-full text-xs border">

<thead className="bg-gray-100 sticky top-0">

<tr>

<th className="border p-2">
  Lane
</th>

<th className="border p-2">
  Dock Cutoff
</th>

<th className="border p-2">
Count
</th>

</tr>

</thead>

<tbody>

{summaryReport.map((row, index) => (
  <tr key={index}>
    <td className="border p-2">{row.lane}</td>
    <td className="border p-2">{row.cutoff}</td>
    <td className="border p-2 text-center">{row.shipment}</td>
    <td className="border p-2 text-center">{row.percent}</td>
  </tr>
))}



</tbody>

</table>

</div>

</div>




            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">



              <div className="bg-white rounded-xl shadow p-5">

                <h3 className="text-gray-500">
                  Total Shipments
                </h3>

                <p className="text-3xl font-bold">
                  {dashboard.totalRows}
                </p>

              </div>




              <div className="bg-white rounded-xl shadow p-5">

                <h3 className="text-gray-500">
                  Connected ON Time
                </h3>

                <p className="text-3xl font-bold">
                  {dashboard.connectedOnTime}
                </p>

              </div>





              <div className="bg-white rounded-xl shadow p-5">

                <h3 className="text-gray-500">
                  Delay Manifested
                </h3>

                <p className="text-3xl font-bold">
                  {dashboard.delayManifested}
                </p>

              </div>





              <div className="bg-white rounded-xl shadow p-5">

                <h3 className="text-gray-500">
                  Manifested ON Time
                </h3>

                <p className="text-3xl font-bold">
                  {dashboard.manifestedOnTime}
                </p>

              </div>





              <div className="bg-white rounded-xl shadow p-5">

                <h3 className="text-gray-500">
                  Not Manifested
                </h3>

                <p className="text-3xl font-bold">
                  {dashboard.notManifested}
                </p>

              </div>


            </div>






<div className="bg-white rounded-xl shadow p-6 mt-10">

  <h2 className="text-xl font-bold mb-5">
    Count Summary
    <div className="bg-white rounded-xl shadow p-6 mt-10">

  <h2 className="text-xl font-bold mb-5">
    Percentage Summary
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full border border-gray-300 text-sm">

      <thead className="bg-blue-100">

        <tr>

          <th className="border p-2">Remarks</th>

          <th className="border p-2">NCR Bamnoli DC</th>

          <th className="border p-2">NCR Bilaspur DC</th>

          <th className="border p-2">
            Process at Bamnoli then connected at Bilaspur after cutoff
          </th>

          <th className="border p-2">Grand Total</th>

        </tr>

      </thead>

      <tbody>

  {dashboard.percentageSummary.map((row: any, index: number) => (

    <tr key={index} className="hover:bg-gray-50">

      <td className="border p-2 font-semibold">
        {row.Remarks}
      </td>

      <td className="border p-2 text-center">
        {row["NCR Bamnoli DC"]}
      </td>

      <td className="border p-2 text-center">
        {row["NCR Bilaspur DC"]}
      </td>

      <td className="border p-2 text-center">
        {row["Process at Bamnoli then connected at Bilaspur after cutoff"]}
      </td>

      <td className="border p-2 text-center font-bold">
        {row["Grand Total"]}
      </td>

    </tr>

  ))}

</tbody>

<tfoot>

<tr className="bg-blue-100 font-bold">

  <td className="border p-2">
    Grand Total
  </td>

  <td className="border p-2 text-center">100%</td>

  <td className="border p-2 text-center">100%</td>

  <td className="border p-2 text-center">100%</td>

  <td className="border p-2 text-center">100%</td>

</tr>

</tfoot>

    </table>

  </div>

</div>
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full border border-gray-300 text-sm">

      <thead className="bg-gray-100">

        <tr>

          <th className="border p-2">Remarks</th>

          <th className="border p-2">NCR Bamnoli DC</th>

          <th className="border p-2">NCR Bilaspur DC</th>

          <th className="border p-2">
            Process at Bamnoli then connected at Bilaspur after cutoff
          </th>

          <th className="border p-2">Grand Total</th>

        </tr>

      </thead>

  <tbody>
    

  {dashboard.countSummary.map((row: any, index: number) => (

    <tr key={index} className="hover:bg-gray-50">

      <td className="border p-2 font-semibold">
        {row.Remarks}
      </td>

      <td className="border p-2 text-center">
        {row["NCR Bamnoli DC"]}
      </td>

      <td className="border p-2 text-center">
        {row["NCR Bilaspur DC"]}
      </td>

      <td className="border p-2 text-center">
        {row["Process at Bamnoli then connected at Bilaspur after cutoff"]}
      </td>

      <td className="border p-2 text-center font-bold">
        {
          row["NCR Bamnoli DC"] +
          row["NCR Bilaspur DC"] +
          row["Process at Bamnoli then connected at Bilaspur after cutoff"]
        }
      </td>

    </tr>

  ))}
<tr className="bg-gray-200 font-bold">

  <td className="border p-2">
    Grand Total
  </td>

  <td className="border p-2 text-center">
    {dashboard.manifestSummary["NCR Bamnoli DC"]}
  </td>

  <td className="border p-2 text-center">
    {dashboard.manifestSummary["NCR Bilaspur DC"]}
  </td>

  <td className="border p-2 text-center">
    {dashboard.manifestSummary["Process at Bamnoli then connected at Bilaspur after cutoff"]}
  </td>

  <td className="border p-2 text-center">
    {dashboard.totalRows}
  </td>

</tr>
</tbody>

    </table>

  </div>

</div>
            




          </div>

        )}



      </section>


    </main>

  );

}