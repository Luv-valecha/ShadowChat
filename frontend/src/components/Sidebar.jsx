import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users, GripVertical, ChevronLeft, ChevronRight, ArrowBigRightDash, ArrowBigLeftDash } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast"

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id) && user.role === "user")
    : users.filter((user) => user.role === "user");

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
    <div className='w-20'>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <aside
        className={`
        h-full border-r border-base-300 flex flex-col
        transition-[width,transform] duration-300 ease-in-out
        bg-base-100

        fixed lg:static
        top-20 left-0 z-40

        ${isExpanded ? "translate-x-0" : "-translate-x-0"}
        ${isExpanded ? "w-[260px] max-w-[80vw]" : "w-20"}

        lg:w-72 lg:translate-x-0
      `}
      >
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
          <div className="lg:hidden flex flex-col gap-3 p-2 -mb-5">
            <button
              onClick={handleCreateRoom}
              className={`flex items-center gap-2 ${isExpanded ? "justify-start" : "justify-center"
                } text-blue-600 hover:scale-105 transition`}
            >
              <span className="text-xl">➕</span>
              {isExpanded && <span>Create Room</span>}
            </button>

            <button
              onClick={() => setShowJoinModal(true)}
              className={`flex items-center gap-2 ${isExpanded ? "justify-start" : "justify-center"
                } text-green-600 hover:scale-105 transition`}
            >
              <span className="text-xl">🔑</span>
              {isExpanded && <span>Join Room</span>}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center -mb-2 gap-2 ${isExpanded ? "justify-start" : "justify-center"
                }`}
            >
              {isExpanded ? (
                <ArrowBigLeftDash className="size-6 opacity-70 group-hover:opacity-100" />
              ) : (
                <ArrowBigRightDash className="size-6 opacity-70 group-hover:opacity-100" />
              )}
              {isExpanded && <span>Collapse</span>}
            </button>
          </div>
        </div>

        {/* display every user in the sidebar */}
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                if (isMobile) setIsExpanded(false);
              }}
              className={`
              box-border  
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 border-l-4 border-primary" : ""}
              `}
            >
              <div
                className={`relative ${isExpanded ? "mx-0" : "mx-auto"
                  } lg:mx-0`}
              >
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
              <div
                className={`overflow-hidden text-left min-w-0 ${isExpanded || window.innerWidth >= 1024 ? "block" : "hidden"
                  }`}
              >
                <div className="font-medium truncate transition-opacity duration-200">{user.fullName}</div>
                <div className="text-sm text-zinc-400 transition-opacity duration-200">
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
    </div>
  )
}

export default Sidebar