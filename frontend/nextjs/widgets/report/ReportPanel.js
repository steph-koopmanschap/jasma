import { ReportDetails } from "@/entities/report/index.js";
import { useGetMultiplePosts } from "@/features/post/index.js";
import { DeleteReportBtn, IgnoreReportBtn, useGetReports } from "@/features/report/index.js";
import Link from "next/link";
import { useMemo, useState } from "react";
import Post from "../post/index.js";
import ReportList from "../report-list";

export function ReportPanel() {
    const [currentActiveReport, setcurrentActiveReport] = useState();
    const [currentActivePost, setcurrentActivePost] = useState();
    const [reports, setReports] = useState([]);
    const [posts, setPosts] = useState([]);

    const {
        isSuccess: reportsIsSuccess,
        isLoading: reportsIsLoading,
        isError: reportsIsError,
        data: reportsData,
        error,
        refetch: reportsRefetch
    } = useGetReports(0, (result) => setReports(result));

    const getPostIds = useMemo(() => {
        if (reportsIsSuccess) {
            let postIds = [];
            for (let i = 0; i < reports.length; i++) {
                postIds.push(reports[i].post_id);
            }
            return postIds;
        }
        return [];
    }, [reportsIsSuccess]);

    //This useQuery only starts fetching after the reportsPosts query has finished fetching
    //Because it needs to use the response data from the first query in the requst of this second query.
    const {
        isSuccess: postsIsSuccess,
        isLoading: postsIsLoading,
        isError: postsIsError,
        data: postsData,
        error: postsError,
        refetch: postsRefetch
    } = useGetMultiplePosts(getPostIds, (result) => setPosts(result?.posts), reportsIsSuccess);

    if (reportsIsLoading) {
        return <h1>Loading...</h1>;
    }

    if (reportsIsError) {
        return <h1>{error.message}</h1>;
    }

    if (reportsData.success === false) {
        return <h1>{data.message}</h1>;
    }

    const getNextReport = (previousIndex) => {
        const nextIndex = previousIndex + 1;
        //Prevent out of bounds error if last report is reached
        if (nextIndex < reports.length && reports.length > 0) {
            const post_id = reports[previousIndex + 1].post_id;
            selectReport(post_id);
        }
    };

    //Remove the report from the client state.
    //This does not delete the report nor delete the post from the server/database
    const removeReportFromState = () => {
        const reportIndex = reports.findIndex((report) => report.post_id === currentActiveReport.post_id);
        //Delete the selected report. Without mutating the original array. (React friendly)
        setReports([...reports.slice(0, reportIndex), ...reports.slice(reportIndex + 1)]);
        getNextReport(reportIndex);
    };

    const selectReport = (post_id) => {
        //Find the correct report in the reports array
        const report = reports.find((report) => report.post_id === post_id);
        setcurrentActiveReport(report);
        ////Find the correct post in the posts array, which belongs to the report
        const post = posts.find((post) => post.post_id === post_id);
        setcurrentActivePost(post);
    };

    return (
        <div className="mt-4">
            <h1 className="text-xl text-center mt-4">JASMA CONTENT MODERATION PANEL)</h1>

            <section className="flex mr-8 ml-8">
                {/* main content */}
                <section className="w-3/4 p-4">
                    <div className="h-screen">
                        {/* Post content */}
                        <div className="border h-1/2 overflow-y-auto">
                            {currentActivePost ? <Post postData={currentActivePost} /> : "Nothing selected yet..."}
                        </div>

                        {/* Report details */}
                        <ReportDetails activeReportData={currentActiveReport} />

                        {/* Buttons */}
                        <div className="flex mx-auto">
                            <button
                                className="bg-amber-400 hover:bg-amber-200 text-black font-bold py-2 px-4 rounded mr-4"
                                onClick={removeReportFromState}
                            >
                                PASS
                            </button>

                            <DeleteReportBtn
                                post_id={currentActiveReport.post_id}
                                onDelete={removeReportFromState}
                            />

                            <IgnoreReportBtn
                                post_id={currentActiveReport.post_id}
                                onIgnore={removeReportFromState}
                            />
                        </div>
                    </div>
                </section>

                {/* Sidebar */}
                <section className="w-1/4">
                    <Link
                        className="text-blue-700"
                        href={"/cms/content-deletetion-policy"}
                    >
                        Content Deletion Policy
                    </Link>

                    <ReportList
                        reports={reports}
                        selectReport={selectReport}
                    />
                </section>
            </section>
        </div>
    );
}
