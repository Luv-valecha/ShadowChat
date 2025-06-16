import { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useAuthStore } from '../store/useAuthStore';
import { useParams } from 'react-router-dom';


const CodeRoom = () => {
    const [code, setCode] = useState('// Start coding...');
    const codeRef = useRef(code);
    const { authUser, socket } = useAuthStore();
    const { roomId } = useParams();
    const [users, setUsers] = useState([]);
    const [language, setLanguage] = useState("cpp");
    const [copying, setCopying] = useState(false);

    const copyRoomId = () => {
        setCopying(true);
        navigator.clipboard.writeText(roomId)
        setTimeout(() => setCopying(false), 2000);
    }

    useEffect(() => {
        socket.emit('join-code-room', roomId, authUser);

        socket.on('code-update', ({ room, code, lang }) => {
            if (room !== roomId) return; // Ignore updates from other rooms
            const incomingCode = code || '// Start coding...'; // Fallback if code is undefined
            if (incomingCode !== codeRef.current) {
                setCode(incomingCode);
            }
            if(lang!=language){
                setLanguage(lang);
            }
        });

        socket.on('room-users', (users) => {
            setUsers(users);
        });

        return () => {
            socket.emit('leave-code-room', roomId);
            socket.off('code-update');
        };
    }, [roomId, authUser, language]);

    const handleChange = (newCode) => {
        if (newCode === undefined) return;
        setCode(newCode);
        codeRef.current = newCode;
        socket.emit('code-update', { room: roomId, code: newCode, lang: language });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white mt-16">
            <div className="max-w-6xl mx-auto py-10 px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white">💻 Code Room</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Room ID:
                            <span className="ml-2 px-2 py-1 bg-gray-800 rounded text-green-400 font-mono">
                                {roomId}
                            </span>
                            <button
                                onClick={copyRoomId}
                                className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 disabled:hover:bg-gray-700"
                                disabled={copying}
                            >
                                {copying ? 'Copied!' : 'Copy'}
                            </button>
                        </p>
                    </div>

                    {/* Language Selector */}
                    <div className="mt-4 md:mt-0">
                        <select
                            value={language}
                            onChange={(e) => {
                                setLanguage(e.target.value);
                                socket.emit('code-update', { room: roomId, code: code, lang:e.target.value });
                            }}
                            className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                            <option value="html">HTML</option>
                        </select>
                    </div>
                </div>

                {/* Editor and Sidebar */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Editor */}
                    <div className="flex-1 bg-black rounded-lg overflow-hidden shadow-lg">
                        <Editor
                            height="70vh"
                            language={language}
                            value={code}
                            theme="vs-dark"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Users Panel */}
                    <div className="w-full lg:w-64 bg-gray-900 rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-2">
                            👥 Connected Users
                        </h3>
                        <ul className="space-y-2">
                            {users.length > 0 ? (
                                users.map((u) =>
                                    u ? (
                                        <li
                                            key={u._id}
                                            className="flex items-center gap-2 text-sm px-2 py-1 rounded bg-gray-800 text-white truncate"
                                            title={u.fullName}
                                        >
                                            <img
                                                src={u.profilePic || "/avatar.png"}
                                                alt={u.fullName}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            <span className="truncate">{u.fullName}</span>
                                        </li>
                                    ) : null
                                )
                            ) : (
                                <li className="text-gray-400 text-sm">No one else is here yet.</li>
                            )}
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    );

};

export default CodeRoom;
