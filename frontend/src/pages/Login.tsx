import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../features/auth/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const data = await loginUser({ email: email, password: password });
            login(data.token, data.user);
            
            // Redirect to Dashboard
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8">
                
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Clario.</h1>
                    <p className="text-gray-400">Sign in to your workspace</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all 
                            ${isSubmitting 
                                ? 'bg-blue-900 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20'}`}
                    >
                        {isSubmitting ? 'Signing in...' : 'Enter Workspace'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;