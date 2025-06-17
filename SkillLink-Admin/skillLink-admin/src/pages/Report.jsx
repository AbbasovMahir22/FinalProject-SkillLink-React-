import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReportList = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchReports = async (filterValue) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${apiUrl}/UserReport/GetAllReports?filter=${filterValue}`, {
                headers: { Authorization: `Bearer ${token}` }
            }
            );
            setReports(response.data.$values);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(filter);
    }, [filter]);

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

            {loading ? (
                <p className="text-center text-gray-500">Loading reports...</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {reports.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">
                            No reports found for selected filter.
                        </p>
                    ) : (
                        reports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() => handleRedirect(report)}
                                className={`${report.targetType === "Post" && "bg-red-200"
                                    } rounded-lg shadow-md border p-4 cursor-pointer hover:shadow-lg transition duration-200`}
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
                                    {report.reporterFullName || report.reporterId}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span className="font-semibold">Reported User:</span>{" "}
                                    {report.reportedUserFullName || report.reportedUserId}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportList;
