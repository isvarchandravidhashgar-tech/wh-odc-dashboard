const REMARKS = [
  "Connected ON time",
  "Delay Manifested",
  "Manifested ON_Time",
  "Not Manifested",
];

const MANIFESTS = [
  "NCR Bamnoli DC",
  "NCR Bilaspur DC",
  "Process at Bamnoli then connected at Bilaspur after cutoff",
];

export function processDashboard(workingData: any[]) {

  // ---------------- Remark Summary ----------------

  const remarkSummary: any = {};

  REMARKS.forEach((remark) => {
    remarkSummary[remark] = workingData.filter(
      (item) => item["Consol_Ops_Remarks"] === remark
    ).length;
  });

  // ---------------- Manifest Summary ----------------

  const manifestSummary: any = {};

  MANIFESTS.forEach((manifest) => {
    manifestSummary[manifest] = workingData.filter(
      (item) => item["Manifested_ODC_1"] === manifest
    ).length;
  });

  // ---------------- Count Summary ----------------

  const countSummary: any[] = [];

  for (const remark of REMARKS) {

    const row: any = {
      Remarks: remark,
    };

    let rowTotal = 0;

    for (const manifest of MANIFESTS) {

      const count = workingData.filter(
        (item) =>
          item["Consol_Ops_Remarks"] === remark &&
          item["Manifested_ODC_1"] === manifest
      ).length;

      row[manifest] = count;
      rowTotal += count;
    }

    row["Grand Total"] = rowTotal;

    countSummary.push(row);
  }

  // ---------------- Percentage Summary ----------------

  const percentageSummary: any[] = [];

  for (const row of countSummary) {

    const percentRow: any = {
      Remarks: row.Remarks,
    };

    for (const manifest of MANIFESTS) {

      const total = manifestSummary[manifest];

      percentRow[manifest] =
        total === 0
          ? "0%"
          : ((row[manifest] / total) * 100).toFixed(2) + "%";
    }

    percentRow["Grand Total"] =
      workingData.length === 0
        ? "0%"
        : ((row["Grand Total"] / workingData.length) * 100).toFixed(2) + "%";

    percentageSummary.push(percentRow);
  }

  // ---------------- Return ----------------

  return {

    totalRows: workingData.length,

    connectedOnTime: remarkSummary["Connected ON time"],

    delayManifested: remarkSummary["Delay Manifested"],

    manifestedOnTime: remarkSummary["Manifested ON_Time"],

    notManifested: remarkSummary["Not Manifested"],

    remarkSummary,

    manifestSummary,

    countSummary,

    percentageSummary,

  };
}