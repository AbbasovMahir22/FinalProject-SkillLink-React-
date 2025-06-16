import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const reports = [
    {
        id: 63,
        targetType: "Post",
        reason: "Spam",
        note: "Post includes irrelevant links to third-party sites.",
        reporterId: "u101",
        reporter: { fullName: "Elvin Məmmədov" },
        reportedUserId: "u201",
        reportedUser: { fullName: "Kamran Əliyev" },
        relatedPostId: "p1001",
        relatedCommentId: null,
    },
    {
        id: "r2",
        targetType: "Comment",
        reason: "Harassment",
        note: "User was being aggressive and rude in the comments.",
        reporterId: "u102",
        reporter: { fullName: "Aysel Həsənova" },
        reportedUserId: "u202",
        reportedUser: { fullName: "Murad Hüseynov" },
        relatedPostId: "p1002",
        relatedCommentId: "c2001",
    },
    {
        id: "r3",
        targetType: "User",
        reason: "Fake Profile",
        note: "User is pretending to be a public figure.",
        reporterId: "u103",
        reporter: { fullName: "Rauf Quliyev" },
        reportedUserId: "u203",
        reportedUser: { fullName: "Səməd Qasımov" },
        relatedPostId: null,
        relatedCommentId: null,
    },
    {
        id: "r4",
        targetType: "Post",
        reason: "Inappropriate Content",
        note: "Contains offensive memes.",
        reporterId: "u104",
        reporter: { fullName: "Nigar Nəsirova" },
        reportedUserId: "u204",
        reportedUser: { fullName: "Ləman Vəliyeva" },
        relatedPostId: "p1003",
        relatedCommentId: null,
    },
    {
        id: "r5",
        targetType: "Comment",
        reason: "Spam",
        note: "Bot-like behavior in comments with repeated ads.",
        reporterId: "u105",
        reporter: { fullName: "Tural Məlikov" },
        reportedUserId: "u205",
        reportedUser: { fullName: "Zaur Əliyev" },
        relatedPostId: "p1004",
        relatedCommentId: "c2002",
    },
    {
        id: "r6",
        targetType: "User",
        reason: "Harassment",
        note: "Sending offensive messages to multiple users.",
        reporterId: "u106",
        reporter: { fullName: "Ayla İbrahimova" },
        reportedUserId: "u206",
        reportedUser: { fullName: "Sadiq Hüseynli" },
        relatedPostId: null,
        relatedCommentId: null,
    },
    {
        id: "r7",
        targetType: "Comment",
        reason: "Inappropriate Comment",
        note: "Comment contains discriminatory language.",
        reporterId: "u107",
        reporter: { fullName: "Samirə Rüstəmova" },
        reportedUserId: "u207",
        reportedUser: { fullName: "Hüseyn Məmmədli" },
        relatedPostId: "p1005",
        relatedCommentId: "c2003",
    },
    {
        id: "r8",
        targetType: "Post",
        reason: "Fake News",
        note: "This post shares false health information.",
        reporterId: "u108",
        reporter: { fullName: "Zeynəb Qasımova" },
        reportedUserId: "u208",
        reportedUser: { fullName: "Namiq Səfərov" },
        relatedPostId: "p1006",
        relatedCommentId: null,
    },
    {
        id: "r9",
        targetType: "User",
        reason: "Scam",
        note: "Trying to get personal data under false pretenses.",
        reporterId: "u109",
        reporter: { fullName: "Eldar Əhmədov" },
        reportedUserId: "u209",
        reportedUser: { fullName: "Fidan Əliyeva" },
        relatedPostId: null,
        relatedCommentId: null,
    },
    {
        id: "r10",
        targetType: "Comment",
        reason: "Harassment",
        note: `This user repeatedly leaves harassing replies under my posts. Its becoming uncomfortable. Here is an example: 
      “You are such a joke, no one cares what you say.”`,
        reporterId: "u110",
        reporter: { fullName: "Nurlan Səlimov" },
        reportedUserId: "u210",
        reportedUser: { fullName: "Aqşin Əliyev" },
        relatedPostId: "p1007",
        relatedCommentId: "c2004",
    },
];

const ReportList = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");

    const handleRedirect = (report) => {
        if (report.targetType === "Post" && report.relatedPostId) {
            navigate(`/postDetail/${report.relatedPostId}`);
        } else if (
            report.targetType === "Comment" &&
            report.relatedPostId &&
            report.relatedCommentId
        ) {
            navigate(`/postDetail/${report.relatedPostId}#comment-${report.relatedCommentId}`);
        } else if (report.targetType === "User" && report.reportedUserId) {
            navigate(`/userDetail/${report.reportedUserId}`);
        }
    };

    const filteredReports =
        filter === "All" ? reports : reports.filter((r) => r.targetType === filter);

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-center md:text-left">User Reports</h2>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Reports</option>
                    <option value="Post">Post Reports</option>
                    <option value="Comment">Comment Reports</option>
                    <option value="User">User Reports</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredReports.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                        No reports found for selected filter.
                    </p>
                )}
                {filteredReports.map((report) => (
                    <div
                        key={report.id}
                        onClick={() => handleRedirect(report)}
                        className={`${report.targetType==='Post'&& 'bg-red-200'} rounded-lg shadow-md border p-4 cursor-pointer hover:shadow-lg transition duration-200`}
                    >
                        <div className="mb-2">
                            <span className="font-semibold">Type:</span>{" "}
                            <span className="capitalize text-blue-700">{report.targetType}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Reason:</span> {report.reason}
                        </div>
                        {report.note && (
                            <div className="mb-2 overflow-hidden text-ellipsis max-h-32 whitespace-pre-line break-words text-gray-700">
                                <span className="font-semibold">Note:</span> {report.note}
                            </div>
                        )}
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Reported By:</span>{" "}
                            {report.reporter?.fullName || report.reporterId}
                        </div>
                        <div className="text-sm text-gray-500">
                            <span className="font-semibold">Reported User:</span>{" "}
                            {report.reportedUser?.fullName || report.reportedUserId}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default ReportList;
