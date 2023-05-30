import React, { useState, useRef, useEffect } from "react";

export function ReportShell({ report, onSelect }) {
    const handleClick = (e) => {
        onSelect(e);
    };

    return (
        <tr
            className={`mb-2 whitespace-nowrap hover:bg-slate-600 ${
                report.isSelected === selectedReportId ? "bg-red-600" : ""
            }`}
            key={report.post_id}
            onClick={handleClick}
        >
            <td className="pr-8">{report.post_id}</td>
            <td className={`${report.reported_x_times > 3 ? "text-red-700" : ""} `}>{report.reported_x_times}</td>
        </tr>
    );
}

//active={(report.isSelected === selectedReportId)}
//onClick={(e) => {console.log("e.target.getAttribute('key')", e.target.getAttribute('key')); selectReport(e.target.getAttribute('key'))}}
