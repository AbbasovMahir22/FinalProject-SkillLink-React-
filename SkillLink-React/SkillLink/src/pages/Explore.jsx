import { useState, useEffect } from "react";
import PostCard from "../components/Posts/PostCard";
import axios from "axios";
import Loader from '../components/Loader';

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

  const token = localStorage.getItem("token");

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

      const response = await axios.get("https://localhost:7067/api/Post/ExplorePosts", {
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
        const res = await axios.get("https://localhost:7067/api/Category/GetAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const cats = res.data.$values || [];
        setCategories(cats);
        console.log(res.data.$values);

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
          `https://localhost:7067/api/SubCategory/GetSubCategoriesByCategoryId/${category}`,
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
  }, [category, subCategory, search]);

  useEffect(() => {
    if (page === 1) return;
    getExplorePosts(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
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
      <div className="flex justify-between items-center px-14">
        <div className="w-[300px] outline-0 h-[50px]">
          <input
            type="text"
            placeholder="Search by user name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 rounded outline-0 w-full h-full bg-gray-300"
          />
        </div>

        <div className="flex items-center gap-10">
          <select onChange={(e) => setCategory(e.target.value)} value={category}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} disabled={!category}>
            <option value="">All SubCategories</option>
            {subCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="place-content-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 px-13">
        {posts.map((post, i) => (
          <PostCard key={post.id || i} post={post} />
        ))}
      </div>

      {loading && <Loader />}
    </div>
  );
}

export default Explore;
