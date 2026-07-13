export function createPivotSummary(
  data: any[],
  groupBy1: string,
  groupBy2: string
) {
  const summaryMap = new Map();

  data.forEach((row) => {
    const value1 = String(row[groupBy1] ?? "").trim();
    const value2 = String(row[groupBy2] ?? "").trim();

    // Blank, -, null values ignore
    if (
      value1 === "" ||
      value2 === "" ||
      value1 === "-" ||
      value2 === "-" ||
      value1.toLowerCase() === "blank" ||
      value2.toLowerCase() === "blank"
    ) {
      return;
    }

    const key = `${value1}||${value2}`;

    if (!summaryMap.has(key)) {
      summaryMap.set(key, {
        group1: value1,
        group2: value2,
        count: 0,
      });
    }

    summaryMap.get(key).count++;
  });

  return Array.from(summaryMap.values()).sort((a: any, b: any) => {
    if (a.group1 === b.group1) {
      return a.group2.localeCompare(b.group2);
    }

    return a.group1.localeCompare(b.group1);
  });
}