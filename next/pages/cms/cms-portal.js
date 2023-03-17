import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import { useQuery } from 'react-query';
import Link from "next/link";
import api from "../../clientAPI/api.js";
import ReportsList from "../../components/cms/ReportsList";
import Post from "../../components/Post";

export default function CMS_Portal() {

    const router = useRouter();

    const [currentActiveReport, setcurrentActiveReport] = useState();
    const [currentActivePost, setcurrentActivePost] = useState();
    const [reports, setReports] = useState([])
    const [posts, setPosts] = useState([]);
    
    useEffect( () => {
        //Check if user is already logged in. If yes, redirect them to cms portal.
        //Because useEffect() itself can not be itself async, a self-executing async function is placed inside useEffect
        (async () => {
            const isLoggedIn = await api.checkAuthClientSide();
            // Replace above line of code with below line of code when page is done.
            //const isLoggedIn = await api.checkAuthModClientSide();
            if (isLoggedIn === false) {
                router.replace('/cms/cms-login');
            }
        })();
        
    }, []);

    const { isSuccess: reportsIsSuccess, isLoading: reportsIsLoading, isError: reportsIsError, data: reportsData, error, refetch: reportsRefetch } = useQuery([`reportsPosts`], 
    async () => {return await api.getReports(0)},
    {   
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: (result) => {setReports(result.reports)} //Load the response data into state upon succesful fetch
    }
    );

    //This useQuery only starts fetching after the reportsPosts query has finished fetching
    //Because it needs to use the response data from the first query in the requst of this second query.
    const { isSuccess: postsIsSuccess, isLoading: postsIsLoading , isError: postsIsError, data: postsData, error: postsError, refetch: postsRefetch } = useQuery([`postsData`], 
    async () => 
    {
        if (reportsIsSuccess) 
        {
            let postIds = [];
            for (let i = 0; i < reports.length; i++) {
                postIds.push(reports[i].post_id);
            }
            return await api.getMultiplePosts(postIds);
        }
    },
    {   
        // Only enable the query if response data from the first query is truthy
        enabled: reportsIsSuccess,
        refetchOnWindowFocus: false,
        retry: false,
        onSuccess: (result) => {setPosts(result?.posts)} //Load the response data into state upon succesful fetch
    }
    );

    if (reportsIsLoading) {
        return (<h1>Loading...</h1>);
    }

    if (reportsIsError) {
        return (<h1>{error}</h1>);
    }

    if (reportsData.success === false) {
        return (<h1>{data.message}</h1>)
    }

    const getNextReport = (previousIndex) => {
        const nextIndex = previousIndex + 1;
        //Prevent out of bounds error if last report is reached
        if (nextIndex < reports.length && reports.length > 0) {
            const post_id = reports[previousIndex + 1].post_id
            selectReport(post_id);
        }
    }

    //Remove the report from the client state. 
    //This does not delete the report nor delete the post from the server/database
    const removeReportFromState = () => {
        const reportIndex = reports.findIndex(report => report.post_id === currentActiveReport.post_id);
        //Delete the selected report. Without mutating the original array. (React friendly)
        setReports([...reports.slice(0, reportIndex), ...reports.slice(reportIndex + 1)]);
        getNextReport(reportIndex);
    }

    const selectReport = (post_id) => {
        //Find the correct report in the reports array
        const report = reports.find(report => report.post_id === post_id);
        setcurrentActiveReport(report);
        ////Find the correct post in the posts array, which belongs to the report
        const post = posts.find(post => post.post_id === post_id);
        setcurrentActivePost(post)
    }

    const deleteReport = async () => {
        const res = await api.deleteReport(currentActiveReport.post_id);
        removeReportFromState();
    }

    const ignoreReport = async () => {
        const res = await api.ignoreReport(currentActiveReport.post_id);
        removeReportFromState();
    }

    return (
    <div className='mt-4'>
        <h1 className="text-xl text-center mt-4">JASMA CONTENT MODERATION SYSTEM (J-CMS)</h1>

        <main className='flex mr-8 ml-8'>
            {/* main content */}
            <section className="w-3/4 p-4">
                <div className='h-screen'>

                    {/* Post content */}
                    <div className="border h-1/2 overflow-y-auto">
                        {currentActivePost ? <Post postData={currentActivePost} /> : "Nothing selected yet..."}
                    </div>
                
                    {/* Report details */}
                    <div>
                        <h2 className='font-bold mt-2 mb-2'>Report Details</h2>
                        <p>
                            <span className='font-bold'>Post_id:</span> {currentActiveReport ? currentActiveReport.post_id : "Null"}
                            <span className='ml-4'><span className='font-bold'>Report time:</span> {currentActiveReport ? currentActiveReport.report_time : "Null"}</span>
                            <span className={`ml-4 ${(currentActiveReport?.reported_x_times > 3) ? 'text-red-700' : ""}`}><span className='font-bold'>Times reported:</span> {currentActiveReport ? currentActiveReport.reported_x_times : "0"}</span>
                        </p>
                        <p className='mt-2 mb-2 border p-2'>
                            Report Reason: <br/>
                            <br/>
                            {currentActiveReport ? currentActiveReport.report_reason : "No reason given."}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className='flex mx-auto'>
                        <button
                            className="bg-amber-400 hover:bg-amber-200 text-black font-bold py-2 px-4 rounded mr-4" 
                            onClick={removeReportFromState}
                        >
                            PASS
                        </button>

                        <button
                            className="bg-red-800 hover:bg-red-600 text-black font-bold py-2 px-4 rounded mr-4" 
                            onClick={deleteReport}
                        >
                            DELETE
                        </button>

                        <button
                            className="bg-green-700 hover:bg-green-500 text-black font-bold py-2 px-4 rounded" 
                            onClick={ignoreReport}
                        >
                            IGNORE
                        </button>
                    </div>

                </div>
            </section>
            
            {/* Sidebar */}
            <section className='w-1/4' >
                <Link className="text-blue-700" href={"/cms/content-deletetion-policy"}>Content Deletion Policy</Link>
                
                <ReportsList reports={reports} selectReport={selectReport} />
            </section>
        </main>
    </div>
    );
}
