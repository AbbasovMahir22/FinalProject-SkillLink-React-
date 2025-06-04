import { useState } from "react";
import PostCreateForm from "./PostCreateForm";
import { IoAddCircleSharp } from "react-icons/io5";

const PostCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true)
  };
  const closeModal = () => {
    setIsOpen(false)
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="bg-green-600 my-1 cursor-pointer flex items-center gap-2  hover:bg-green-500 hover:text-black transition duration-300 text-white px-4 py-2 rounded-lg"
      >
        Add  <IoAddCircleSharp size={20} />
      </button>

      {isOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50   bg-opacity-70 backdrop-blur-xs flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className=" w-full max-w-xl p-6 bg-opacity-10 bg-cyan-50 shadow-lg relative animate-fade-in"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 cursor-pointer right-2 text-black hover:text-red-600 text-[30px] font-bold"
            >
              &times;
            </button>

            <PostCreateForm closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCreateModal;
