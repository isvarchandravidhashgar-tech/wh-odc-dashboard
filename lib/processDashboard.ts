export function processDashboard(
  baseData: any[],
  mappingData: any[],
  manifestData: any[]
) {
  return {
    totalBaseRows: baseData.length,
    totalMappingRows: mappingData.length,
    totalManifestRows: manifestData.length,
  };
}