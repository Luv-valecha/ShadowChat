import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast"

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id) && user.role==="user")
    : users.filter((user) => user.role==="user");

  // get all users to list at the sidebar
  useEffect(() => {
    getUsers()
  }, [getUsers]);

  const [roomIdInput, setRoomIdInput] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const newRoomId = uuidv4(); // Generate unique room ID
    navigate(`/editor/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomIdInput.trim()) {
      toast.error("Please enter a valid room ID");
      return;
    }
    navigate(`/editor/${roomIdInput.trim()}`);
  };

  // loading screen
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Top Section: Header + Filter */}
      <div className="border-b border-base-300 w-full p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Filter row (online toggle) */}
        <div className="hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>

        {/* Shared Code Room */}
        <div className="hidden lg:block p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold mb-3">Shared Code Room</h2>

          <button
            onClick={handleCreateRoom}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ Create New Room
          </button>

          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button
              onClick={handleJoinRoom}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              Join
            </button>
          </div>
        </div>
        <div className="lg:hidden flex flex-col items-center gap-3 p-2">
          <button
            onClick={handleCreateRoom}
            title="Create Room"
            className="text-blue-600 text-xl hover:scale-110 transition"
          >
            ➕
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            title="Join Room"
            className="text-green-600 text-xl hover:scale-110 transition"
          >
            🔑
          </button>
        </div>
      </div>

      {/* display every user in the sidebar */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>

      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">Enter Room ID</h2>
            <input
              type="text"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              placeholder="Room ID"
              className="w-full border px-3 py-2 rounded text-sm mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const id = roomIdInput.trim();
                  if (!id) return toast.error("Room ID is required");
                  navigate(`/editor/${id}`);
                  setRoomIdInput('');
                  setShowJoinModal(false);
                }}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar