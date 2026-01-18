import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../features/auth/authService';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="min-h-screen bg-[#050712] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden">
            {/* Animated background gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-md w-full relative z-10 my-4 sm:my-6">
                {/* Logo and branding */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-lg sm:text-xl font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                            CL
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-sm sm:text-base text-slate-400">Sign in to continue your productivity journey</p>
                </div>

                {/* Login card */}
                <div className="rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-slate-950/10 shadow-[0_22px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 sm:p-6 md:p-8">
                    {error && (
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-950/50 border border-red-800/50 text-red-200 rounded-xl text-xs sm:text-sm backdrop-blur-xl">
                            <div className="flex items-center gap-2">
                                <span className="text-red-400">⚠</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700/80 text-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700/80 text-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 sm:py-3.5 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg
                                ${isSubmitting 
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6 sm:my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800/60"></div>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
                            <span className="px-3 bg-slate-950/80 text-slate-500 uppercase tracking-wider">New to Clario?</span>
                        </div>
                    </div>

                    {/* Sign up link */}
                    <Link 
                        to="/signup"
                        className="block w-full py-3 sm:py-3.5 px-4 rounded-xl font-semibold text-sm sm:text-base text-center border-2 border-slate-700/80 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60 hover:border-slate-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Create Account
                    </Link>
                </div>

                {/* Footer text */}
                <p className="mt-6 text-center text-xs sm:text-sm text-slate-500">
                    By continuing, you agree to Clario's Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Login;