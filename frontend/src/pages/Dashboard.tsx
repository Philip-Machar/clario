import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username} 👋</h1>
            <p className="text-gray-400 mb-8">This is the protected dashboard.</p>
            
            <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
