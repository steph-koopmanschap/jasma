import React, { useState, useRef, useEffect } from 'react';

export default function ReportsList(props) {

    const { reports, selectReport } = props;
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
    }

    return ( 
        <React.Fragment>
        <h2 className="font-bold mb-2">Report List</h2>
        <div className='border p-4 overflow-y-auto'>


            <table>
                <thead>
                    <tr>
                        <th scope="col" className=''>ID:</th>
                        <th scope="col" className='hover:cursor-pointer' onClick={handleSortFilter}>Times Reported:</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {reports.map((report) => (
                    <tr
                        className={`mb-2 whitespace-nowrap hover:bg-slate-600 ${(report.isSelected === selectedReportId) ? "bg-red-600" : ""}`}
                        key={report.post_id}
                        onClick={(e) => {handleSelect(e)}}
                    >
                        <td className='pr-8'>
                            {report.post_id}
                        </td>
                        <td className={`${(report.reported_x_times > 3) ? 'text-red-700' : ""} `}>
                            {report.reported_x_times}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </React.Fragment>
    );
}

//active={(report.isSelected === selectedReportId)}
//onClick={(e) => {console.log("e.target.getAttribute('key')", e.target.getAttribute('key')); selectReport(e.target.getAttribute('key'))}}
