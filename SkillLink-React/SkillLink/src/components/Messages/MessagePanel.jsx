import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { IoSend } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import * as signalR from "@microsoft/signalr";
import { Link } from 'react-router-dom';

export default function MessagePanel({ selectedUser }) {
    const [messages, setMessages] = useState([]);
    const [values, setValues] = useState("");
    const connectionRef = useRef(null);
    const currentUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const messageContainerRef = useRef(null);

    const deleteMessage = async (id) => {

        const token = localStorage.getItem("token");
        await axios.delete(`https://localhost:7067/api/PrivateChat/Delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`https://localhost:7067/api/PrivateChat/GetAll/${selectedUser.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessages(res.data.$values || []);
            } catch (error) {
                console.error("Mesajlari yükləmə xetasi:", error);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    useEffect(() => {

        if (!selectedUser) return;

        const connectToHub = async () => {
            if (connectionRef.current && connectionRef.current.state === "Connected") {
                await connectionRef.current.stop();
            }

            const connection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:7067/chathub", {
                    accessTokenFactory: () => token
                })
                .withAutomaticReconnect()
                .build();

            connection.on("ReceiveMessage", (message) => {

                if (selectedUser.id == message.senderId) {
                    setMessages(prev => [...prev, message]);
                }
            }
            );
            connection.on("DeleteMessage", (id) => {

                setMessages(prev => prev.filter(msg => msg.id !== id));
            });

            try {
                await connection.start();
                connectionRef.current = connection;
            } catch (err) {
            }
        };

        connectToHub();

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
                connectionRef.current = null;
            }
        };
    }, [selectedUser]);
    useEffect(() => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);
    const handleSendMessage = async () => {
        if (!values.trim()) return;

        const newMessage = {
            message: values,
            receiverId: selectedUser.id
        };

        try {
            const newId = await axios.post("https://localhost:7067/api/PrivateChat/Create", newMessage, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            });
            setMessages(prev => [
                ...prev,
                {
                    id: newId.data,
                    message: values,
                    senderId: currentUserId,
                    receiverId: selectedUser.id,
                    fromMe: true,
                    createdDate: new Date().toISOString()
                }
            ]);



            setValues("");
        } catch (error) {
            console.error("Mesaj göndərmə xetasi:", error);
        }
    };

    return (
        <div className="flex-1 p-4 flex flex-col bg-cyan-50"

        >
            {selectedUser ? (
                <>
                    <div className="font-bold  border-b pb-2 flex   items-center gap-2.5"
                    >
                        <Link to={`/userDetail/${selectedUser.id}`} className='flex  items-center gap-2.5'>
                            <img className='w-[45px] h-[45px] rounded-full' src={selectedUser.imgUrl} />
                            <p>
                                {selectedUser.fullaname}

                            </p>
                        </Link>
                    </div>
                    <div ref={messageContainerRef} className="flex-1 bg-green-200 overflow-y-auto select-none py-2.5 space-y-3"
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`py-2  rounded max-w-xs relative break-words px-5 ml-2 ${msg.fromMe ? 'ml-auto bg-amber-100' : 'mr-auto bg-white'}`}
                            >
                                {msg.message}
                                {msg.fromMe && (
                                    <TiDelete
                                        onClick={() => deleteMessage(msg.id)}
                                        className="absolute cursor-pointer -left-2 -top-3 transition duration-300 hover:text-red-700"
                                        size={20}
                                    />
                                )}

                            </div>
                        ))}
                    </div>
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            value={values}
                            placeholder="Type a message..."
                            className="w-full p-2 rounded border-2 focus:border-blue-500 outline-0"
                            onChange={(e) => setValues(e.target.value)}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-blue-600"
                        >
                            <IoSend size={20} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-gray-400 text-center mt-20">Select a user to chat</div>

            )}
        </div>
    );
}
