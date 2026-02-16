import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { useState } from 'react';

const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
        .min(8, 'New password must be at least 8 characters')
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your new password'),
});

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: passwordSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await authService.changePassword({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                });
                toast.success('Password changed successfully!');
                resetForm();
                navigate('/profile');
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                toast.error(err.response?.data?.message || 'Failed to change password');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="h-full overflow-auto bg-slate-950">
            <div className="max-w-xl mx-auto py-10 px-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Change Password</h1>
                        <p className="text-sm text-slate-400">Update your account password</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Lock className="w-4 h-4 text-violet-400" />
                        <h3 className="text-sm font-semibold text-white">Password Update</h3>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-slate-300 text-sm">
                                Current Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrent ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...formik.getFieldProps('currentPassword')}
                                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-violet-500 h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                >
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formik.touched.currentPassword && formik.errors.currentPassword && (
                                <p className="text-red-400 text-xs">{formik.errors.currentPassword}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-slate-300 text-sm">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNew ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...formik.getFieldProps('newPassword')}
                                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-violet-500 h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formik.touched.newPassword && formik.errors.newPassword && (
                                <p className="text-red-400 text-xs">{formik.errors.newPassword}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-300 text-sm">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...formik.getFieldProps('confirmPassword')}
                                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-violet-500 h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-red-400 text-xs">{formik.errors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate('/profile')}
                                className="border-slate-600 bg-slate-800 text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white"
                            >
                                {formik.isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Update Password'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
