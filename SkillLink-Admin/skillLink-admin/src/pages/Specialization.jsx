import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../components/Spinner";
import AddSpecializationModal from "../components/Specialization/AddSpecializationModal";
import EditSpecializationModal from "../components/Specialization/EditSpecializationModal";
import "react-toastify/dist/ReactToastify.css";




export default function Specialization() {
  const token = sessionStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  const fetchSpecializations = async (reset = false) => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/Admin/Specialization/GetAllSpecializationForAdmin`, {
        params: { pageNumber, pageSize: 10, search: searchTerm },
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetched = res.data.$values;


      if (reset) {
        setItems(fetched);
      } else {
        setItems((prev) => [...prev, ...fetched]);
      }

      setHasMore(fetched.length === 10);
    } catch {
      toast.error("Failed to fetch specializations");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpecializations(pageNumber === 1);
  }, [pageNumber, searchTerm]);

  useEffect(() => {
    setPageNumber(1);
    setItems([]);
    setHasMore(true);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/Admin/Specialization/Delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((sp) => sp.id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  const handleCreated = (newItem) => setItems((prev) => [newItem, ...prev]);
  const handleUpdated = (updated) =>
    setItems((prev) => prev.map((sp) => (sp.id === updated.id ? updated : sp)));

  return (
    <div className="p-6 select-none relative">
      <ToastContainer position="top-right" autoClose={3000} />


      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Specializations</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 rounded border p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus />
            <span className="hidden sm:inline cursor-pointer">Add</span>
          </button>
        </div>
      </div>


      <div className="overflow-x-auto max-w-full">
        <table className="w-full table-fixed bg-white shadow-md rounded-lg overflow-hidden text-xs md:text-sm">
          <thead className="bg-gray-100 whitespace-nowrap">
            <tr>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left font-medium text-gray-700">ID</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left font-medium text-gray-700">Name</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left font-medium text-gray-700 hidden md:table-cell">Users</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((sp, idx) => {
              const isLast = idx === items.length - 1;
              return (
                <tr
                  key={sp.id}
                  ref={isLast ? lastElementRef : null}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-2 md:px-6 py-2 md:py-4">{sp.id}</td>
                  <td className="px-2 md:px-6 py-2 md:py-4 break-words max-w-[140px] md:max-w-none">{sp.name}</td>
                  <td className="px-2 md:px-6 py-2 md:py-4 hidden md:table-cell">{sp.users}</td>
                  <td className="px-2 md:px-6 py-2 md:py-4 flex justify-end gap-3">
                    <button
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={() => {
                        setItemToEdit(sp);
                        setShowUpdateModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => handleDelete(sp.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && <Spinner />}
      </div>


      {showCreateModal && (
        <AddSpecializationModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}
      {showUpdateModal && itemToEdit && (
        <EditSpecializationModal
          specialization={itemToEdit}
          onClose={() => setShowUpdateModal(false)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
