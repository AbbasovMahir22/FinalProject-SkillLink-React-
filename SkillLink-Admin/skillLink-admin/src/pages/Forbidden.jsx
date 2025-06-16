import Forbidden from '../../public/403.webp'
const ForbiddenPage = () => {
    return (

        <img
            src={Forbidden}
            alt="Access Denied"
            className="object-contain min-w-screen max-h-screen"
        />

    );
};

export default ForbiddenPage;
