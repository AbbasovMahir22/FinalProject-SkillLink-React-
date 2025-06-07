import { useState } from 'react';
import UserListPanel from '../components/Messages/UserListPanel';
import MessagePanel from '../components/Messages/MessagePanel';

export default function Messages() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex flex-col md:flex-row h-screen ">
      <div className={`transition-all duration-300 ease-in-out
        ${selectedUser ? 'hidden md:block md:w-1/3 lg:w-1/4' : 'block w-full'}
      `}>
        <UserListPanel onUserSelect={setSelectedUser} />
      </div>

      <div className={`flex-1 transition-all duration-300 ease-in-out
        ${selectedUser ? 'block w-full' : 'hidden md:block'}
      `}>
        <MessagePanel selectedUser={selectedUser} onBack={() => setSelectedUser(null)} />
      </div>
    </div>
  );
}