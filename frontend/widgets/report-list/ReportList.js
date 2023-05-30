import { ReportShell } from "@/entities/report";
import { useState } from "react";

export function ReportList({ reports, selectReport }) {
    for (let i = 0; i < reports.length; i++) {
        reports[i].isSelected = false;
    }

    const [selectedReportId, setSelectedReportId] = useState(null);

    //const {SelectedReports, setIsSelectedReports} = useState([]);

    const handleSelect = (e) => {
        const id = e.target.textContent;
        selectReport(id);
        setSelectedReportId(id === selectedReportId ? null : id);
    };

    //Sort the reports from highest number of times reported to lowest.
    const handleSortFilter = () => {
        reports.sort((a, b) => b.reported_x_times - a.reported_x_times);
    };

    return (
        <>
            <h2 className="font-bold mb-2">Report List</h2>
            <div className="border p-4 overflow-y-auto">
                <table>
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className=""
                            >
                                ID:
                            </th>
                            <th
                                scope="col"
                                className="hover:cursor-pointer"
                                onClick={handleSortFilter}
                            >
                                Times Reported:
                            </th>
                        </tr>
                    </thead>
                    <tbody classaName="divide-y divide-gray-200">
                        {reports.map((report) => (
                            <ReportShell
                                {...report}
                                key={report.post_id}
                                onSelect={handleSelect}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

//active={(report.isSelected === selectedReportId)}
//onClick={(e) => {console.log("e.target.getAttribute('key')", e.target.getAttribute('key')); selectReport(e.target.getAttribute('key'))}}
