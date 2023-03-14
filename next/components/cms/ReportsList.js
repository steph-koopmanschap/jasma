import { useQuery } from 'react-query';
import api from "../../clientAPI/api.js";

export default function ReportsList(props) {

    const { status, isLoading, isError, data, error, refetch } = useQuery([`reportsPosts`], 
    async () => {return await api.getReports(0)},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    if (isLoading) {
        return (<h1>Retrieving reports...</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    if (data.success === false) {
        return (<h1>{data.message}</h1>)
    }

    return ( 
        <div>
            {data.reports.map((report) => (
                <div key={report.report_id}>
                    <p>{report.repord_id}</p>
                </div>
            ))}
        </div>
    );
}
