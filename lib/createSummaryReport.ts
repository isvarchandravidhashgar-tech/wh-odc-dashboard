export function createSummaryReport(
  data: any[],
  selectedRemarks: string[],
  selectedManifest: string[],
  selectedClient: string[]
) {
  let filtered = [...data];

  // Remarks Filter
  if (selectedRemarks.length > 0) {
    filtered = filtered.filter((row) =>
      selectedRemarks.includes(row.Consol_Ops_Remarks)
    );
  }

  // Manifest Filter
  if (selectedManifest.length > 0) {
    filtered = filtered.filter((row) =>
      selectedManifest.includes(row.Manifested_ODC_1)
    );
  }

  // Client Filter
  if (selectedClient.length > 0) {
    filtered = filtered.filter((row) =>
      selectedClient.includes(row.client)
    );
  }

  const total = filtered.length;

  const map = new Map();

  filtered.forEach((row) => {
    const lane = row.Lane_1 || "Blank";
    const cutoff = row.Dock_Cut_off_1 || "Blank";

    const key = lane + "||" + cutoff;

    if (!map.has(key)) {
      map.set(key, {
        lane,
        cutoff,
        shipment: 0,
      });
    }

    map.get(key).shipment++;
  });

  const result = Array.from(map.values()).map((row: any) => ({
    ...row,
    percent:
      total === 0
        ? "0%"
        : ((row.shipment / total) * 100).toFixed(2) + "%",
  }));

  result.sort((a: any, b: any) => b.shipment - a.shipment);

  return result;
}