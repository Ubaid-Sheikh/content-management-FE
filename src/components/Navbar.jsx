import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 py-4">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                <Link to="/" className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 group">
                    BX<span className="text-slate-400 group-hover:text-slate-900 transition-colors">TRACK</span>
                </Link>

                <div className="flex items-center gap-8">
                    {isAuthenticated ? (
                        <>
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{user.name}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">/</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:underline underline-offset-4">
                                Join
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
