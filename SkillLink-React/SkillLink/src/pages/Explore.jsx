import { useState, useEffect } from "react";
import PostCard from "../components/Posts/PostCard";
import axios from "axios";
import Loader from '../components/Loader';
import { HubConnectionBuilder } from "@microsoft/signalr";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [mediaType, setMediaType] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/postHub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("SignalR connected for Explore page");

      connection.on("PostDeleted", (postId) => {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      });
    });

    return () => {
      connection.stop();
    };
  }, [])
  const getExplorePosts = async (pageToFetch, reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);


    try {
      const params = {
        page: pageToFetch,
        pageSize: 10,
      };
      if (category) params.category = category;
      if (subCategory) params.subCategory = subCategory;
      if (search) params.search = search;
      if (mediaType) params.mediaType = mediaType;
      const response = await axios.get(`${apiUrl}/Post/ExplorePosts`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newPosts = response.data.$values || [];

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error("Postlar yuklenmedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${apiUrl}/Category/GetAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const cats = res.data.$values || [];
        setCategories(cats);

      } catch (error) {
        console.error("Kategorya yukleme xetasi:", error);
      }
    };

    fetchCategories();
  }, [token]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!category) {
        setSubCategories([]);
        setSubCategory("");
        return;
      }

      try {
        const res = await axios.get(
          `${apiUrl}/SubCategory/GetSubCategoriesByCategoryId/${category}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const subs = res.data.$values || [];
        setSubCategories(subs);
        setSubCategory("");
      } catch (error) {
        console.error("Alt kategorya yukleme xetasi:", error);
      }
    };

    fetchSubCategories();
  }, [category, token]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    getExplorePosts(1, true);
  }, [category, subCategory, search, mediaType]);

  useEffect(() => {
    if (page === 1) return;
    getExplorePosts(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 400 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="my-5">
      <div className="flex flex-col md:flex-row justify-between gap-6 px-4 md:px-8 lg:px-14 items-end">
        <input
          type="text"
          placeholder='Search by Full Name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[300px] h-[45px] px-4 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
        />

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 pr-8 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            disabled={!category}
            className={`w-full sm:w-auto px-4 py-2 pr-8 rounded-lg border ${!category
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white shadow-sm border-gray-300"
              } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200`}
          >
            <option value=""> All SubCategories</option>
            {subCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 pr-8 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
          >
            <option value="">All Media</option>
            <option value="video">Only Video</option>
            <option value="image">Only Image</option>
          </select>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 px-4 md:px-8 lg:px-14">
        {posts.length === 0 && !loading && (
          <p className="text-center col-span-full text-gray-500 text-lg font-semibold">
            No posts found.
          </p>
        )}
        {posts.map((post, i) => (
          <PostCard key={post.id || i} post={post} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <Loader />
        </div>
      )}
    </div>
  );

}

export default Explore;
