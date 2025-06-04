import { useState } from 'react';
import UserList from '../components/Messages/UserListPanel';
import MessageBox from '../components/Messages/MessagePanel';

export default function Messages() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-[600px]">
      <UserList onUserSelect={setSelectedUser} />
      <MessageBox selectedUser={selectedUser} />
    </div>
  );
}