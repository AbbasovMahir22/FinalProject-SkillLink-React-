import Unauthorized from '../../public/what-is-a-401-error.png'
const UnauthorizedPage = () => {
    return (

        <img
            src={Unauthorized}
            alt="Access Denied"
            className="object-contain min-w-screen max-h-screen"
        />

    );
};

export default UnauthorizedPage;
