import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../features/auth/authService';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsSubmitting(true);

        try {
            const data = await registerUser({ username, email, password });
            login(data.token, data.user);
            
            // Redirect to Dashboard
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create account');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050712] flex items-center justify-center p-3 sm:p-4 md:p-4 lg:p-6 relative overflow-y-auto">
            {/* Animated background gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-md w-full relative z-10 my-6 sm:my-8 md:my-4 lg:my-6">
                {/* Logo and branding */}
                <div className="text-center mb-4 sm:mb-6 md:mb-3 lg:mb-4">
                    <div className="inline-flex items-center justify-center mb-3 md:mb-2">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-12 md:w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-base sm:text-lg md:text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                            CL
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold text-slate-50 mb-1 sm:mb-2 tracking-tight">Create Account</h1>
                    <p className="text-xs sm:text-sm md:text-xs lg:text-sm text-slate-400">Start your productivity journey with Clario</p>
                </div>

                {/* Sign up card */}
                <div className="rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-slate-950/10 shadow-[0_22px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-4 sm:p-5 md:p-4 lg:p-5">
                    {error && (
                        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-950/50 border border-red-800/50 text-red-200 rounded-xl text-xs sm:text-sm backdrop-blur-xl">
                            <div className="flex items-center gap-2">
                                <span className="text-red-400">⚠</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-3">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1.5 md:mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700/80 text-slate-100 px-3 sm:px-4 py-2 sm:py-2.5 md:py-2 rounded-xl text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="johndoe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700/80 text-slate-100 px-3 sm:px-4 py-2 sm:py-2.5 md:py-2 rounded-xl text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
                                className="w-full bg-slate-900/80 border border-slate-700/80 text-slate-100 px-3 sm:px-4 py-2 sm:py-2.5 md:py-2 rounded-xl text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <p className="mt-1 text-xs text-slate-500">Must be at least 6 characters</p>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700/80 text-slate-100 px-3 sm:px-4 py-2 sm:py-2.5 md:py-2 rounded-xl text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2.5 sm:py-3 md:py-2.5 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg
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
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-3 sm:my-4 md:my-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800/60"></div>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
                            <span className="px-3 bg-slate-950/80 text-slate-500 uppercase tracking-wider">Already have an account?</span>
                        </div>
                    </div>

                    {/* Sign in link */}
                    <Link 
                        to="/login"
                        className="block w-full py-2.5 sm:py-3 md:py-2.5 px-4 rounded-xl font-semibold text-sm sm:text-base text-center border-2 border-slate-700/80 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60 hover:border-slate-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Footer text */}
                <p className="mt-3 sm:mt-4 md:mt-3 text-center text-xs sm:text-sm text-slate-500">
                    By creating an account, you agree to Clario's Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default SignUp;
