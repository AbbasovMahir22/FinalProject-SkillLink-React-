import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useSnackbar } from "notistack";

const PostDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();


    const highlightCommentId = location.hash ? location.hash.replace("#comment-", "") : null;

    const apiUrl = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem("token");
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const commentRefs = useRef({});

    useEffect(() => {
        const fetchPostAndComments = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiUrl}/Post/GetPostForAdmin/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.data) {
                    enqueueSnackbar("Post notfound", { variant: "error" });
                    setTimeout(() => {
                        navigate("/Report");
                    }, 1500);
                }
                setPost(res.data);

                const commentsData = res.data.comments?.$values || [];
                const found = commentsData.some(
                    (comment) => comment.id.toString() === highlightCommentId
                );
                if (!found && highlightCommentId) {
                    enqueueSnackbar("Comment notfound", { variant: "error" });
                    setTimeout(() => {
                        navigate("/Report");
                    }, 1500);
                }

                setComments(commentsData);
            } catch (err) {
                console.error("Data fetch error:", err);
                setPost(null);
                setComments([]);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPostAndComments();
        }
    }, [id, apiUrl, token]);

    useEffect(() => {
        if (highlightCommentId && commentRefs.current[highlightCommentId]) {
            commentRefs.current[highlightCommentId].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [highlightCommentId, comments]);

    if (loading) return <p className="text-center mt-8 text-blue-500"><spinner /></p>;
    if (!post) return <p className="text-center mt-8 text-red-500">Post notfound.</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

            <div className="mb-6">
                {post.mediaType === "video" ? (
                    <video
                        controls
                        src={post.mediaUrl}
                        className="w-full max-h-[400px] rounded-lg"
                    />
                ) : (
                    <img
                        src={post.mediaUrl}
                        alt="Post Media"
                        className="w-full max-h-[400px] object-cover rounded-lg"
                    />
                )}
            </div>

            <p className="text-gray-700 mb-6 whitespace-pre-line">{post.desc}</p>

            <h2 className="text-xl font-semibold mb-4">Comments:</h2>

            <div className="space-y-2 max-h-[350px] overflow-y-auto ">
                {comments.length === 0 ? (
                    <p className="text-gray-500">There are no comments for this post.</p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            id={`comment-${comment.id}`}
                            ref={(el) => (commentRefs.current[comment.id] = el)}
                            className={`border p-2 rounded-md  transition-all duration-300 ${highlightCommentId === comment.id.toString() ? "bg-yellow-200 border-red-400" : "bg-gray-200"
                                }`}
                        >
                            <Link to={`/UserDetail/${comment.userId}`}>
                                <div className="text-xs text-gray-500  ">
                                    <span className="font-medium text-[18px] text-yellow-600 hover:text-red-500">{comment?.userFullName}</span>
                                </div>
                            </Link>
                            <p className="text-sm text-gray-800 whitespace-pre-line">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default PostDetail;
