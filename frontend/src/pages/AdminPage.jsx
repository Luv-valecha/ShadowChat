import { useEffect, useState } from 'react';
import { axiosInstance } from "../lib/axios.js";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';
import StatCard from '../components/StatCard';
import StatCardSkeleton from '../components/skeletons/StatCardSkeleton';
import UserList from '../components/UserList';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState(null);
    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/admin/stats');
                setStats(response.data);

                const msgperday = await axiosInstance.get('/admin/perdaymsgs');
                const labels = msgperday.data.map(d => d._id);
                const values = msgperday.data.map(d => d.count);
                setChartData({
                    labels,
                    datasets: [{
                        label: 'Messages Sent',
                        data: values,
                        backgroundColor: '#4f46e5'
                    }]
                });
            } catch (error) {
                setError(error);
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <StatCardSkeleton />
        );
    }
    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="flex justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="Users" value={stats.userCount} />
                    <StatCard title="Active Users" value={stats.activeUsers} />
                    <StatCard title="Messages" value={stats.messageCount} />
                </div>
            </div>


            <div className="bg-black p-4 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-2 text-center text-white">Message Activity</h2>
                <div className="w-full h-[450px]">
                    <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>


            <UserList />
        </div>
    );
};

export default AdminPage