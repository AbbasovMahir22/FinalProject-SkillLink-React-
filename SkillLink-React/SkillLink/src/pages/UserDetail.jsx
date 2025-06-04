import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserInfo from "../components/User/UserInfo";
import UserPosts from "../components/User/UserPosts";
import Loader from '../components/Loader';
import FilterPanel from "../components/Posts/FilterPanel";
import { getUserIdFromToken } from "../components/User/GetUserIdFromToken";

const UserDetail = () => {
    const navigate=useNavigate();
    const { id } = useParams();
    const myId=getUserIdFromToken();
    if (id===myId) {
        navigate("/myProfile");
    }
    console.log(id);
    console.log(myId);
    
    
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ categoryId: "", subCategoryId: "" ,isVideo: ""});

    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get(`https://localhost:7067/api/Account/GetUserProfile/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setUser(res.data);
            setLoading(false);
        };

        fetchUser();
    }, [id]);



    return (
        <div className="max-w-5/6 mx-auto p-4 bg-gray-100">
            {loading && <Loader />}
            <UserInfo userInfo={user} />
            <FilterPanel onFilterChange={setFilters} />
            <UserPosts userId={id} filters={filters} />
        </div>
    );
};

export default UserDetail;
