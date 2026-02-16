import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { CheckSquare, Loader2, Eye, EyeOff } from 'lucide-react';

const signUpSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(45, 'Name must not exceed 45 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

export default function SignUpPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        document.title = 'My Planner';
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: signUpSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await register({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                });
                toast.success('Account created! Please sign in.');
                navigate('/login');
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                toast.error(err.response?.data?.message || 'Registration failed');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950 p-4">
            <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                            <CheckSquare className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">MyPlanner</h1>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">Start organizing your tasks today</p>
                </div>

                {/* Card */}
                <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-gray-200 dark:border-slate-800/60 rounded-2xl p-8 shadow-2xl shadow-black/5 dark:shadow-black/20">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create an account</h2>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Fill in your details to get started</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 dark:text-slate-300 text-sm font-medium">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...formik.getFieldProps('name')}
                                className="bg-gray-100 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20 h-11"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-400 text-xs">{formik.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-slate-300 text-sm font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...formik.getFieldProps('email')}
                                className="bg-gray-100 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20 h-11"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-400 text-xs">{formik.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 dark:text-slate-300 text-sm font-medium">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...formik.getFieldProps('password')}
                                    className="bg-gray-100 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20 h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-400 text-xs">{formik.errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-slate-300 text-sm font-medium">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...formik.getFieldProps('confirmPassword')}
                                    className="bg-gray-100 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20 h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-red-400 text-xs">{formik.errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-violet-500/25 transition-all duration-200 mt-2"
                        >
                            {formik.isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 dark:text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
