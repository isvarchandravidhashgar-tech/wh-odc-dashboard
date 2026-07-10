import * as XLSX from "xlsx";
import Papa from "papaparse";

export function readExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    // CSV Files
    if (file.name.toLowerCase().endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        worker: true,
        complete: (results) => {
          console.log("CSV Rows:", results.data.length);
          resolve(results.data as any[]);
        },
        error: (error) => {
          reject(error);
        },
      });

      return;
    }

    // Excel Files (.xlsx / .xls)
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;

        const workbook = XLSX.read(data, {
          type: "array",
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          raw: false,
        });

        console.log("Excel Rows:", json.length);

        resolve(json);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsArrayBuffer(file);
  });
}