const db = require("../db/connections/jasmaAdmin");
const { deleteFile } = require("../utils/deleteFile.js");
const { ReportedPost, Post } = db.models;

//User creates a report on a post
async function createReport(req, res) {
    const { post_id, report_reason } = req.body;

    //First check if the post has already been reported.
    const checkReportExists = await ReportedPost.getById(post_id);
    console.log("checkReportExists", checkReportExists);
    if (checkReportExists === undefined) {
        //If the post has not yet been reported create a new report for it.
        const createdReport = await ReportedPost.create({
            post_id: post_id,
            report_reason: report_reason
        });
    }
    else 
    {
        //If the post has already been reported increase the counter by 1 for the amounts of reports on this post.
        const updatedReport = await ReportedPost.update(
            {
                reported_x_times: checkReportExists.reported_x_times + 1
            },
            {
                where:
                    { post_id: post_id }
            });
    }

    return res.json({ success: true, post_id: post_id });
}

// If limit is 0 then all reports are fetched
async function getReports(req, res) {
    const { limit } = req.query;

    const reports = await ReportedPost.getReports(limit)

    return res.json({ success: true, reports: reports });
}

//Delete a report AND delete the linked post
async function deleteReport(req, res) {
    const { postID } = req.params;

    //First delete the post and its file.
    const resFileUrl = await db.query(`SELECT file_url FROM posts WHERE post_id = ?`, {
        replacements: [postID]
    });

    //Delete the file accociated to the post, only if there is a file accociated with it.
    if (//resFileUrl[0].length !== 0 ||
        resFileUrl[0][0].file_url !== `${process.env.HOSTNAME}:${process.env.PORT}/media/posts/undefined`)
    {
        deleteFile(resFileUrl[0][0].file_url);
    }

    const deletedPost = await Post.destroy({
        where: {
            post_id: postID
        }
    });

    const deletedReport = await ReportedPost.destroy({
        where: {
            post_id: postID
        }
    });

    return res.json({ success: true, post_id: postID });
}

//Delete a report, but do not delete the linked post. (Used for false reports)
async function ignoreReport(req, res) {
    const { postID } = req.params;
    
    const ignoredReport = await ReportedPost.destroy({
        where: {
            post_id: postID
        }
    });
    
    return res.json({ success: true, post_id: postID });
}

module.exports = {
    createReport, 
    getReports,
    deleteReport,
    ignoreReport
};

