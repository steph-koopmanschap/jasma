import { formatDistance } from "date-fns";

export const ReportDetails = ({ activeReportData }) => {
    return (
        <div>
            <h2 className="font-bold mt-2 mb-2">Report Details</h2>
            <p>
                <span className="font-bold">Post_id:</span> {activeReportData ? activeReportData.post_id : "Null"}
                <span className="ml-4">
                    <span className="font-bold mr-2">Report time:</span>
                    {activeReportData ? formatDistance(new Date(activeReportData.report_time), new Date()) : "Null"} a
                    go. ({activeReportData ? activeReportData.report_time : "Null"})
                </span>
                <span className={`ml-4 ${activeReportData?.reported_x_times > 3 ? "text-red-700" : ""}`}>
                    <span className="font-bold">Times reported:</span>{" "}
                    {activeReportData ? activeReportData.reported_x_times : "0"}
                </span>
            </p>
            <p className="mt-2 mb-2 border p-2">
                Report Reason: <br />
                <br />
                {activeReportData ? activeReportData.report_reason : "No reason given."}
            </p>
        </div>
    );
};
