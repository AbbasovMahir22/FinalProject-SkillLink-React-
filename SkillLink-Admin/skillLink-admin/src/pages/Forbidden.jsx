import { useNavigate } from 'react-router-dom';
import Forbidden from '../../public/403.webp'
const ForbiddenPage = () => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        window.history.back();
    }
    return (
        <div className='relative flex justify-center items-center object-cover'>
            <img
                src={Forbidden}
                alt="Access Denied"
                className=" w-[1000px] h-[737px] "
            />
            <button
                onClick={handleNavigate}
                className="px-10 w-[200px] py-3 text-white font-bold duration-300 bg-blue-600 hover:bg-blue-700 cursor-pointer rounded absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                Back
            </button>

        </div>

    );
};

export default ForbiddenPage;
