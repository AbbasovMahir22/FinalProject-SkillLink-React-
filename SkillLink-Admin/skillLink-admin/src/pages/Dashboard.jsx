import TotalCount from "../components/dashboard/TotalCount";
import CategoryData from "../components/Category/CategoryData";
import RecentPosts from "../components/dashboard/RecentPosts";
import RecentUsers from "../components/dashboard/RecentUser";
import TopUsers from "../components/dashboard/TopUsers";
const Dashboard = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
        localStorage.setItem('token', token);
        // URL-dən tokeni silmək üçün
        window.history.replaceState({}, document.title, "/");
    }

    return (
        <div className="p-4 flex flex-col  gap-5">
            <TotalCount />
            <CategoryData />
            <RecentPosts />
            <RecentUsers />
            <TopUsers />
        </div>
    );
};

export default Dashboard;
