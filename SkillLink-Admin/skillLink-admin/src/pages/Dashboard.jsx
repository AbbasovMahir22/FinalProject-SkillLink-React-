import TotalCount from "../components/dashboard/TotalCount";
import CategoryData from "../components/Category/CategoryData";
import RecentPosts from "../components/dashboard/RecentPosts";
import RecentUsers from "../components/dashboard/RecentUser";
import TopUsers from "../components/dashboard/TopUsers";
const Dashboard = () => {

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
