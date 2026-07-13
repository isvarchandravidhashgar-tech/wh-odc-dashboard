"use client";

type Props = {
  workingData: any[];
};

export default function SummaryReport({ workingData }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <div className="grid grid-cols-3 gap-4 mb-5">

        <div>
          <label className="text-sm font-semibold">
            Remarks
          </label>

          <div className="border rounded p-2 text-sm bg-gray-50">
            Multi Select
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">
            Manifest
          </label>

          <div className="border rounded p-2 text-sm bg-gray-50">
            Multi Select
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">
            Client
          </label>

          <div className="border rounded p-2 text-sm bg-gray-50">
            Multi Select
          </div>
        </div>

      </div>

      <div className="overflow-auto max-h-[500px]">

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
                Shipment Count
              </th>

              <th className="border p-2">
                %
              </th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td className="border p-2">
                Demo
              </td>

              <td className="border p-2">
                06:00 AM
              </td>

              <td className="border p-2 text-center">
                100
              </td>

              <td className="border p-2 text-center">
                100%
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}