import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { IoSend } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import * as signalR from "@microsoft/signalr";
import { Link } from 'react-router-dom';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import FakeIMage from '../../assets/Images/FakeImage.jpg';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function MessagePanel({ selectedUser, onBack }) {
    const [messages, setMessages] = useState([]);
    const [values, setValues] = useState("");
    const connectionRef = useRef(null);
    const currentUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const messageContainerRef = useRef(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const editMessage = (id, currentText) => {
        setEditingMessageId(id);
        setEditingText(currentText);
    };

    const saveEditedMessage = async (id) => {
        if (!editingText.trim()) return;

        try {
            await axios.put(`${apiUrl}/PrivateChat/Update/${id}`, {
                message: editingText
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });



            setEditingMessageId(null);
            setEditingText("");
        } catch (error) {
            console.error("Mesaj edit xetasi:", error);
        }
    };
    const deleteMessage = async (id) => {
        await axios.delete(`${apiUrl}/PrivateChat/Delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    };

    useEffect(() => {
        if (!selectedUser) return;
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${apiUrl}/PrivateChat/GetAll/${selectedUser.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(res.data.$values || []);
            } catch (error) {
                console.error("mesajlari yukleme xetasi:", error);
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
                .withUrl(`${apiUrl}/chathub`, {
                    accessTokenFactory: () => token
                })
                .withAutomaticReconnect()
                .build();

            connection.on("ReceiveMessage", (message) => {
                if (selectedUser && selectedUser.id == message.senderId) {
                    setMessages(prev => [...prev, message]);
                } else {
                    toast.info(
                        <div className="flex items-center gap-3">
                            <img
                                src={message.senderImg || FakeIMage}
                                alt="avatar"
                                className="w-15 h-15 rounded-full object-cover border border-gray-300"
                            />
                            <div>
                                <p className="text-sm font-semibold">{message.senderFullName}</p>
                                <p className="text-xs text-gray-600">New message</p>
                            </div>
                        </div>,
                        {
                            position: "top-right",
                            autoClose: 3000,
                        }
                    );


                }
            });
            connection.on("UpdateMessage", (editedMessage) => {
                setMessages((prev) => prev.map((msg) => {
                    return msg.id === editedMessage.id ? { ...msg, message: editedMessage.message } : msg;
                }));
            });

            connection.on("DeleteMessage", (id) => {
                setMessages(prev => prev.filter(msg => msg.id !== id));
            });

            try {
                await connection.start();
                connectionRef.current = connection;
            } catch { }
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
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages]);

    const handleSendMessage = async () => {
        if (!values.trim()) return;

        const newMessage = {
            message: values,
            receiverId: selectedUser.id
        };

        try {
            const newId = await axios.post(`${apiUrl}/PrivateChat/Create`, newMessage, {
                headers: { Authorization: `Bearer ${token}` }
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
            console.error("Mesaj gonderme xetasi:", error);
        }
    };

    return (
        <div className="flex-1 p-4 flex flex-col bg-cyan-50 min-h-[650px] max-h-[650px]">
            <ToastContainer />
            <div className="md:hidden mb-4">
                <button
                    onClick={onBack}
                    className="text-cyan-700 cursor-pointer hover:text-red-600  font-extrabold "
                >
                    <IoReturnUpBackSharp size={25} />
                </button>
            </div>
            {selectedUser ? (
                <>
                    <div className="font-semibold text-lg border-b pb-2 flex items-center gap-3 mb-3">

                        {selectedUser.imgUrl ? (
                            <Link to={`/userDetail/${selectedUser.id}`}>
                                <img className="w-12 h-12 rounded-full border-2 border-cyan-300" src={selectedUser.imgUrl} alt="User" />
                            </Link>
                        )
                            : (
                                <Link to={`/userDetail/${selectedUser.id}`}>
                                    <FaUserCircle className='w-12 h-12 border-2 rounded-full cursor-pointer' />
                                </Link>
                            )}
                        <p className="text-gray-800 text-[18px] font-medium">{selectedUser.fullaname}</p>

                    </div>

                    <div
                        ref={messageContainerRef}
                        className="flex-1 bg-white rounded-lg p-4 overflow-y-auto shadow-inner space-y-3"
                    >
                        {messages.map((msg, i) => {
                            const isEditing = editingMessageId === msg.id;
                            return (
                                <div
                                    key={i}
                                    className={`relative select-none py-2 px-4 max-w-[40%] rounded-2xl shadow-sm break-words ${msg.fromMe
                                        ? 'ml-auto bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-300 text-yellow-900 text-right shadow-yellow-400/30'
                                        : 'mr-auto bg-gradient-to-br from-cyan-200 via-cyan-100 to-cyan-300 text-cyan-900 text-left shadow-cyan-400/30'
                                        }`}
                                    onDoubleClick={() => msg.fromMe && editMessage(msg.id, msg.message)}
                                >
                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEditedMessage(msg.id);
                                                }}
                                                autoFocus
                                                className="w-full px-2 py-1 rounded border border-cyan-400 outline-none"
                                            />
                                            <button
                                                onClick={() => saveEditedMessage(msg.id)}
                                                className="text-sm cursor-pointer text-cyan-700 font-medium hover:text-black"
                                            >
                                                OK
                                            </button>
                                        </div>
                                    ) : (
                                        <span>{msg.message}</span>
                                    )}
                                    {msg.fromMe && !isEditing && (
                                        <TiDelete
                                            onClick={() => deleteMessage(msg.id)}
                                            className="absolute -left-3 -top-3 text-gray-600 hover:text-red-600 cursor-pointer"
                                            size={18}
                                        />
                                    )}
                                </div>
                            );
                        })}

                    </div>

                    <div className="mt-4 relative">
                        <input
                            type="text"
                            value={values}
                            placeholder="Write a message..."
                            className="w-full p-3 pr-10 rounded-full border-2 border-cyan-300 focus:border-blue-400 outline-none shadow-sm transition"
                            onChange={(e) => setValues(e.target.value)}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-cyan-700 hover:text-blue-600 transition transform active:scale-90"
                        >
                            <IoSend size={22} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-gray-400 text-center mt-20 text-lg font-medium"></div>
            )
            }
        </div >
    );
}
