import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const staticPost = {
    id: "p1001",
    title: "Frontend və UI dizayn prinsipləri",
    mediaType: "image", // "video" da ola bilər
    mediaUrl: "https://via.placeholder.com/800x400.png?text=Sample+Post+Image",
    description: `Bu postda frontend interfeyslərinin necə tərtib olunması müzakirə olunur.\nResponsivlik, istifadəçi təcrübəsi və performans əsas mövzulardır.`,
};

const staticComments = [
    {
        id: "c1",
        content: "Çox faydalı məlumatdır, təşəkkürlər!",
        user: { fullName: "Elvin Məmmədov" },
    },
    {
        id: "c2",
        content: "Video əlavə etsəydiniz daha yaxşı olardı.",
        user: { fullName: "Aysel Həsənova" },
    },
    {
        id: "c3",
        content: "Burada qeyd olunan UX qaydaları çox köhnədir.",
        user: { fullName: "Rauf Quliyev" },
    },
];

const PostDetail = () => {
    const { postId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const highlightCommentId = queryParams.get("highlightCommentId");

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // Static datanı təyin edirik
        setPost(staticPost);
        setComments(staticComments);
    }, []);

    if (!post) return <p className="text-center mt-8 text-red-500">Post tapılmadı.</p>;

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

            <p className="text-gray-700 mb-6 whitespace-pre-line">{post.description}</p>

            <h2 className="text-xl font-semibold mb-4">Şərhlər:</h2>

            <div className="space-y-4">
                {comments.length === 0 && (
                    <p className="text-gray-500">Bu posta heç bir şərh yazılmayıb.</p>
                )}
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        id={`comment-${comment.id}`}
                        className={`border p-4 rounded-md transition-all duration-300 ${highlightCommentId === comment.id
                                ? "bg-red-100 border-red-400"
                                : "bg-white"
                            }`}
                    >
                        <p className="text-sm text-gray-800 whitespace-pre-line">{comment.content}</p>
                        <div className="text-xs text-gray-500 mt-2">
                            Yazan:{" "}
                            <span className="font-medium">
                                {comment.user?.fullName || "Anonim"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostDetail;
