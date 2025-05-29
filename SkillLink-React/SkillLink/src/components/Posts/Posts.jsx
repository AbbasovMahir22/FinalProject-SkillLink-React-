import PostCard from './PostCard';



const Posts = ({ datas }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {datas?.map((post) => (

                <PostCard key={post.$id} post={post} />

            ))}
        </div>
    );
};

export default Posts;