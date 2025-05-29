import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { FiSend, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import sound from '../../public/mixkit-doorbell-tone-2864.wav';

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const notificationAudio = useRef(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const connectionRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getUsers = async () => {
      try {
        const res = await axios.get("https://localhost:7067/api/PrivateChat/GetExistUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.$values);
      } catch (err) {
        console.error(err);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .get(`https://localhost:7067/api/PrivateChat/GetAll/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data.$values))
      .catch((err) => console.error(err));
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;

    const token = localStorage.getItem("token");
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7067/notificationhub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveMessage", (data) => {
      console.log(data);

      setMessages((prev) => [...prev, { fromMe: false, message: data.message }]);

      if (notificationAudio.current) {
        notificationAudio.current.play().catch((err) => {
          console.warn("Səs çalma xətasi:", err);
        });
      }
    });

    connection
      .start()
      .then(() => console.log("Connected"))
      .catch((err) => console.error("Error:", err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [selectedUser]);

  const handleSend = async () => {
    if (input.trim() === "") return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "https://localhost:7067/api/PrivateChat/Create",
        { message: input, receiverId: selectedUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { fromMe: true, message: input }]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (index, id) => {
    const newText = prompt("Mesajı yenilə:", messages[index].message);
    if (newText && newText.trim() !== "") {
      const token = localStorage.getItem("token");
      try {
        await axios.put(
          `https://localhost:7067/api/PrivateChat/Update/${id}`,
          { message: newText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((prev) =>
          prev.map((msg, i) => (i === index ? { ...msg, message: newText } : msg))
        );
        setMenuOpenFor(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (index, id) => {
    if (!window.confirm("Mesajı silmək istədiyinizə əminsiniz?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://localhost:7067/api/PrivateChat/Delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((_, i) => i !== index));
      setMenuOpenFor(null);
    } catch (err) {
      console.error(err);
    }
  };

  const messagesContainerHeight = isMobile ? "calc(600px - 120px)" : "auto";

  return (
    <div className="flex justify-center items-center py-4">
      <audio ref={notificationAudio} src={sound} preload="auto" />
      <div className="w-full max-w-5xl h-[600px] rounded shadow overflow-hidden flex flex-col md:flex-row relative">
        {(!isMobile || !selectedUser) && (
          <div className="md:w-1/3 w-full bg-white border-r overflow-y-auto max-h-[600px]">
            <div className="p-4 text-xl font-bold border-b bg-white">Mesajlar</div>
            {users?.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 ${selectedUser === user.id ? "bg-gray-200" : ""}`}
              >
                <img src={user.imgUrl} className="w-[40px] h-[40px] rounded-full" alt="User avatar" />
                <div>
                  <div className="font-medium">{user.fullName || user.fullaname}</div>
                  <div className="text-sm text-gray-500 truncate w-40">Son mesaj...</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(selectedUser || !isMobile) && (
          <div className="md:w-2/3 w-full flex flex-col bg-white">
            <div className="p-4 bg-white border-b font-semibold text-lg flex items-center gap-2">
              {isMobile && (
                <button onClick={() => setSelectedUser(null)} className="mr-2 text-gray-600">
                  <IoArrowBack size={20} />
                </button>
              )}
              {users.find(u => u.id === selectedUser)?.fullName || "Mesaj"}
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 py-2 space-y-3"
              style={{ maxHeight: messagesContainerHeight }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`relative max-w-xs px-4 py-2 rounded-lg flex items-center gap-2 ${msg.fromMe ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-gray-800 self-start"}`}
                >
                  <div>{msg.message}</div>
                  <button
                    className="ml-2 p-1 cursor-pointer rounded-full"
                    onClick={() => setMenuOpenFor(menuOpenFor === i ? null : i)}
                  >
                    <span className="text-lg font-bold"></span>
                  </button>
                  {menuOpenFor === i && (
                    <div className="absolute top-full right-0 mt-1 bg-white border rounded shadow-md z-50 flex gap-2 p-2">
                      <button onClick={() => handleUpdate(i, msg.id)} className="text-blue-600">
                        <FiEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(i, msg.id)} className="text-red-600">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              className={`bg-white p-4 border-t flex items-center gap-3 ${isMobile ? "fixed bottom-45 left-0 right-0 px-4" : ""}`}
              style={
                isMobile
                  ? { boxShadow: "0 -2px 10px rgb(0 0 0 / 0.1)", maxWidth: "100vw", zIndex: 50 }
                  : {}
              }
            >
              <input
                type="text"
                placeholder="Mesaj yaz..."
                className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                onClick={handleSend}
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
