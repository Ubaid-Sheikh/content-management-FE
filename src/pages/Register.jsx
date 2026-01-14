import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';

const Register = () => {
    const navigate = useNavigate();
    const { register: signup, loading } = useAuthStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'VIEWER',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        try {
            await signup(formData);
            toast.success('Registration successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-white px-4 py-12 fade-in">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Create Account</h1>
                    <p className="text-slate-500 text-sm">Join the workspace to start contributing</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-0 transition-all outline-none text-slate-900 placeholder:text-slate-300"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-0 transition-all outline-none text-slate-900 placeholder:text-slate-300"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-0 transition-all outline-none text-slate-900 placeholder:text-slate-300"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="role" className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-0 transition-all outline-none text-slate-900 appearance-none cursor-pointer"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="VIEWER">Viewer</option>
                            <option value="EDITOR">Editor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.99] disabled:opacity-50 mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-slate-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-slate-900 font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
