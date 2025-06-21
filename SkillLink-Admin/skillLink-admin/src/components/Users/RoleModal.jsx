function RoleModal({ currentRole, onClose, onSave }) {
    const [role, setRole] = useState(currentRole);
    const roles = ["Member", "Admin", "SuperAdmin"];
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Change Role</h2>
                <select
                    className="w-full border rounded p-2 mb-4"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    {roles.map((r) => (
                        <option key={r}>{r}</option>
                    ))}
                </select>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(role)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
export default RoleModal;