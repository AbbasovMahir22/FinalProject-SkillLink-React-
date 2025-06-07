import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from '../components/Loader';
import { FaUserCircle } from "react-icons/fa";
import NotificationFilter from "../components/Notification/NotificationFilter";

const Notifications = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/Notification/GetAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data.$values);

      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications =
    filterType === "All"
      ? notifications
      : notifications.filter((n) => n.type === filterType);

  return (
    <div className="h-auto bg-transparent p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-6 mt-4 relative">
        {loading && <Loader />}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 border-b pb-4 mb-4">
          <FaBell className="text-blue-600 text-xl sm:text-2xl" />
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
            Notifications
          </h1>
        </div>

        <NotificationFilter selectedType={filterType} onFilterChange={setFilterType} />

        {filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications found.</div>
        ) : (
          <ul className="space-y-4 h-[450px] overflow-y-auto">
            {filteredNotifications.map((n, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row items-start gap-3 bg-gray-200 hover:bg-cyan-200 p-4 rounded-lg shadow-sm transition-all duration-300"
              >
                {n.userImage ? (
                  <img
                    src={n.userImg}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover border shadow-sm"
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 border shadow-sm rounded-full" />
                )}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
                    <Link
                      to={`/userdetail/${n.userId}`}
                      className="text-blue-700 font-semibold hover:text-red-700"
                    >
                      {n.userFullName}
                    </Link>
                    <span className="text-xs text-gray-400">{n.actionDate}</span>
                  </div>

                  <div className="text-sm sm:text-base text-gray-700">
                    {n.postId && n.commentId ? (
                      <Link
                        to={`/postdetail/${n.postId}#comment-${n.commentId}`}
                        className="hover:underline text-blue-600 font-medium"
                      >
                        {n.message}
                      </Link>
                    ) : n.postId ? (
                      <Link
                        to={`/postdetail/${n.postId}`}
                        className="hover:underline text-blue-600 font-medium"
                      >
                        {n.message}
                      </Link>
                    ) : (
                      n.message
                    )}
                  </div>

                  <div className="mt-1 text-sm text-red-500 text-right font-extrabold italic">
                    {n.type}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
