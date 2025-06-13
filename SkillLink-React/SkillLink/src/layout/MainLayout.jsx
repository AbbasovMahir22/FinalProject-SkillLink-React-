import { Outlet } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { startConnection, stopConnection } from '../signalR';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useEffect } from 'react';
import SignalRListener from '../components/Notification/SignalRListener';
import { Toaster } from "react-hot-toast";

const MySwal = withReactContent(Swal);

export const showNotification = (message) => {
    console.log(message);

    MySwal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: 'lightGreen',
        customClass: {
            popup: 'custom-toast'
        },
        html: `
            <div style="display: flex; align-items: center; ">
                <img src="${message.userImg}" 
                     alt="${message.fullName}" 
                     style="width: 60px; height: 60px; border-radius: 50%; margin-right: 10px;" />
                <div style="text-align: left;">
                    <div style="font-weight: 600; color:black">${message.fullName}</div>
                    <div style="font-size: 14px; color:black">${message.message}</div>
                </div>
            </div>
        `
    });
};
function MainLayout() {


    useEffect(() => {
        const token = localStorage.getItem("token");
        startConnection(token, (message) => {
            showNotification({
                fullName: message.fullName,
                message: message.message,
                userImg: message.userImg
            });

        });

        return () => {
            stopConnection();
        };
    }, [])

    return (
        <div className="min-h-screen flex flex-col relative">
            <Toaster position="top-center" />
            <SignalRListener />
            <Navbar />
            <main
                className="flex-grow px-6 bg-gray-50"
            >
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
