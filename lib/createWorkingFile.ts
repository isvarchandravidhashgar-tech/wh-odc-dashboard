export function createWorkingFile(
  baseData: any[],
  mappingData: any[],
  manifestData: any[]
) {
  // Fast lookup for Mapping File
  const mappingLookup = new Map();

  mappingData.forEach((row) => {
    mappingLookup.set(row["hub_name"], row);
  });
  const awbLookup = new Map();

manifestData.forEach((row) => {
  const awb = row["awb_number"];
  const hub = row["scanned_location"];

  if (!awbLookup.has(awb)) {
    awbLookup.set(awb, []);
  }

  awbLookup.get(awb).push(hub);
});
const manifestRemarkLookup = new Map();

awbLookup.forEach((hubs, awb) => {
  if (
    hubs.includes("NCR Bamnoli DC") &&
    hubs.includes("NCR Bilaspur DC")
  ) {
    manifestRemarkLookup.set(
      awb,
      "Process at Bamnoli then connected at Bilaspur after cutoff"
    );
  } else {
    manifestRemarkLookup.set(
      awb,
      hubs[hubs.length - 1]
    );
  }
});
  const workingData = baseData.map((row) => {
    const mapping = mappingLookup.get(row["destination_hub"]);

    return {
      ...row,

      // ===== New Columns =====
 Lane_1: mapping ? mapping["Lane Code"] : "",

Type_1: mapping ? mapping["Lane Type"] : "",

Dock_Cut_off_1: mapping ? mapping["STD"] : "",

Processing_cut_off_1: (() => {
  let dock = mapping ? mapping["STD"] : "";

  // Default Dock Time
  if (!dock || dock === "-") {
    dock = "7:00 AM";
  }

  const date = new Date(`2000-01-01 ${dock}`);

  // 1 hour minus
  date.setHours(date.getHours() - 1);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
})(),
Final_Cut_off_1:
  row["system_assigned_mode_of_travel"] === "AIR_PRIORITY" ||
  row["system_assigned_mode_of_travel"] === "PRIME_AIR_PRIORITY"
    ? "06:00 AM"
    : (() => {
        let dock = mapping ? mapping["STD"] : "";

        if (!dock || dock === "-") {
          dock = "7:00 AM";
        }

        const date = new Date(`2000-01-01 ${dock}`);
        date.setHours(date.getHours() - 1);

        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      })(),
Ops_Remarks:
  row["Final_remarks"] === "W24 Hrs" ||
  row["Final_remarks"] === "W36 Hrs"
    ? "Connected ON time"
    : "Ops Miss",
Pickup_Remarks: (() => {
  const picked = row["picked_date"];
  const received = row["received_time_bagging_dc"];

  // Blank received time
  if (!received) {
    return "Pickup Miss (Delay Picked)";
  }

  const pickedDate = new Date(picked);
  const receivedDate = new Date(received);

  const diffHours =
    (receivedDate.getTime() - pickedDate.getTime()) / (1000 * 60 * 60);

  return diffHours <= 15
    ? "On_time Picked"
    : "Pickup Miss (Delay Picked)";
})(),
"Same-Day": (() => {
  if (!row["picked_date_only"]) return "";

  const picked = new Date(row["picked_date_only"]);

  const year = picked.getFullYear();
  const month = picked.getMonth() + 1;
  const day = picked.getDate();

  let finalCutoff = "";

  if (
    row["system_assigned_mode_of_travel"] === "AIR_PRIORITY" ||
    row["system_assigned_mode_of_travel"] === "PRIME_AIR_PRIORITY"
  ) {
    finalCutoff = "06:00 AM";
  } else {
    let dock = mapping ? mapping["STD"] : "";

    if (!dock || dock === "-") {
      dock = "7:00 AM";
    }

    const date = new Date(`2000-01-01 ${dock}`);
    date.setHours(date.getHours() - 1);

    finalCutoff = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const [time, ampm] = finalCutoff.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return `${year}-${month}-${day} ${hour}:${String(minute).padStart(2, "0")}`;
})(),
"Next-Day": (() => {
  if (!row["picked_date_only"]) return "";

  const picked = new Date(row["picked_date_only"]);

  // Add 1 day
  picked.setDate(picked.getDate() + 1);

  const year = picked.getFullYear();
  const month = picked.getMonth() + 1;
  const day = picked.getDate();

  let finalCutoff = "";

  if (
    row["system_assigned_mode_of_travel"] === "AIR_PRIORITY" ||
    row["system_assigned_mode_of_travel"] === "PRIME_AIR_PRIORITY"
  ) {
    finalCutoff = "06:00 AM";
  } else {
    let dock = mapping ? mapping["STD"] : "";

    if (!dock || dock === "-") {
      dock = "7:00 AM";
    }

    const date = new Date(`2000-01-01 ${dock}`);
    date.setHours(date.getHours() - 1);

    finalCutoff = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const [time, ampm] = finalCutoff.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return `${year}-${month}-${day} ${hour}:${String(minute).padStart(2, "0")}`;
})(),
"Zonal Remark": (() => {
  const manifested = row["manifest_creation_bagging_dc"];

  // Agar Manifest blank hai
  if (!manifested) {
    return "Not Manifested";
  }

  // Same-Day Date
  const picked = new Date(row["picked_date_only"]);

  // Final Cutoff Time
  let finalCutoff = "";

  if (
    row["system_assigned_mode_of_travel"] === "AIR_PRIORITY" ||
    row["system_assigned_mode_of_travel"] === "PRIME_AIR_PRIORITY"
  ) {
    finalCutoff = "06:00 AM";
  } else {
    let dock = mapping ? mapping["STD"] : "";

    if (!dock || dock === "-") {
      dock = "7:00 AM";
    }

    const d = new Date(`2000-01-01 ${dock}`);
    d.setHours(d.getHours() - 1);

    finalCutoff = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Same-Day DateTime
  const sameDay = new Date(picked);

  const [time, ampm] = finalCutoff.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  sameDay.setHours(hour, minute, 0, 0);

  // Compare
  const manifestTime = new Date(manifested);

  return manifestTime <= sameDay
    ? "Manifested ON_Time (Dock Miss)"
    : "Delay Manifested";
})(),
"Zonal+National_Remarks Day 1": (() => {
  const manifested = row["manifest_creation_bagging_dc"];

  // Agar Manifest blank hai
  if (!manifested) {
    return "Not Manifested";
  }

  // Next-Day Date
  const picked = new Date(row["picked_date_only"]);
  picked.setDate(picked.getDate() + 1);

  // Final Cutoff Time
  let finalCutoff = "";

  if (
    row["system_assigned_mode_of_travel"] === "AIR_PRIORITY" ||
    row["system_assigned_mode_of_travel"] === "PRIME_AIR_PRIORITY"
  ) {
    finalCutoff = "06:00 AM";
  } else {
    let dock = mapping ? mapping["STD"] : "";

    if (!dock || dock === "-") {
      dock = "7:00 AM";
    }

    const d = new Date(`2000-01-01 ${dock}`);
    d.setHours(d.getHours() - 1);

    finalCutoff = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Next-Day DateTime
  const nextDay = new Date(picked);

  const [time, ampm] = finalCutoff.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  nextDay.setHours(hour, minute, 0, 0);

  const manifestTime = new Date(manifested);

  return manifestTime <= nextDay
    ? "Manifested ON_Time (Dock Miss)"
    : "Delay Manifested";
})(),
Manifested_ODC_1:
  manifestRemarkLookup.get(row["awb_number"]) || "NCR Bamnoli DC",

Consol_Ops_Remarks: (() => {
  // CD = Ops_Remarks
  if (row["Final_remarks"] === "W24 Hrs" || row["Final_remarks"] === "W36 Hrs") {
    return "Connected ON time";
  }

  // CI = Zonal+National_Remarks Day 1
  const manifested = row["manifest_creation_bagging_dc"];

  if (!manifested) {
    return "Not Manifested";
  }

  // Next-Day Date
  const picked = new Date(row["picked_date_only"]);
  picked.setDate(picked.getDate() + 1);

  // Final Cutoff
  let finalCutoff = "";

  if (
    row["system_assigned_mode_of_travel"] === "AIR_PRIORITY" ||
    row["system_assigned_mode_of_travel"] === "PRIME_AIR_PRIORITY"
  ) {
    finalCutoff = "06:00 AM";
  } else {
    let dock = mapping ? mapping["STD"] : "";

    if (!dock || dock === "-") {
      dock = "7:00 AM";
    }

    const d = new Date(`2000-01-01 ${dock}`);
    d.setHours(d.getHours() - 1);

    finalCutoff = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const [time, ampm] = finalCutoff.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  picked.setHours(hour, minute, 0, 0);

  const manifestTime = new Date(manifested);

  return manifestTime <= picked
    ? "Manifested ON_Time (Dock Miss)"
    : "Delay Manifested";
})(),
Remarks1: "",
    };
  });

  return workingData;
}