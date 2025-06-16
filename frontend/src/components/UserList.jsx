import { useEffect, useState } from 'react';
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from '../store/useAuthStore.js';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { authUser } = useAuthStore();

    useEffect(() => {
        axiosInstance.get('/admin/allusers')
            .then(res => setUsers(res.data));
    }, []);

    const DeleteUser = (e) => {
        const userId = e.target.closest('tr').getAttribute('data-user-id');
        axiosInstance.delete(`admin/deleteuser/${userId}`)
            .then(() => {
                setUsers(users.filter(user => user._id !== userId));
            })
            .catch(err => {
                console.error("Error deleting user:", err);
            });
    }

    const promoteUser = (e) => {
        const userId = e.target.closest('tr').getAttribute('data-user-id');
        axiosInstance.put(`admin/promoteuser/${userId}`)
            .then(res => {
                if (res.status === 200) {
                    setUsers(users.map(user =>
                        user._id === userId ? { ...user, role: 'admin' } : user
                    ));
                } else {
                    alert(res.data.message);
                }
            })
            .catch(err => {
                console.error("Error promoting user:", err);
            });
    }

    return (
        <div className="bg-black p-4 rounded-xl shadow mt-6">
            <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-2">Username</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Role</th>
                            <th className="p-2">Joined</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} data-user-id={u._id} className="border-t text-white">
                                <td className="p-2">{u.fullName}</td>
                                <td className="p-2">{u.email}</td>
                                <td className="p-2">{u.role}</td>
                                <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="p-2">
                                    <div className="inline-flex gap-1">
                                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" onClick={DeleteUser}>Delete</button>
                                        <button
                                            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r
             hover:bg-gray-400 disabled:hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={u._id === authUser._id}
                                            onClick={promoteUser}
                                        >
                                            {u.role === 'admin' ? "Demote" : "Promote"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
