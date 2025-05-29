const NotificationFilter = ({ selectedType, onFilterChange }) => {
    const filters = ["All", "Like", "Follow"];

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center sm:gap-4 gap-2 mb-4">
            {filters.map((type) => (
                <button
                    key={type}
                    onClick={() => onFilterChange(type)}
                    className={`w-full cursor-pointer sm:w-auto text-center px-4 py-2 rounded-full border ${selectedType === type
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border-gray-300"
                        } transition duration-300`}
                >
                    {type}
                </button>
            ))}
        </div>
    );
};

export default NotificationFilter;
