import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';
import { Loader2, User, Mail, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

const nameSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(45, 'Name must not exceed 45 characters')
        .required('Name is required'),
});

export default function ProfilePage() {
    const { name, email, changeName } = useAuth();
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState(name || '');
    const [profileEmail, setProfileEmail] = useState(email || '');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await authService.getProfile();
                setProfileName(res.data.data.name);
                setProfileEmail(res.data.data.email);
            } catch {
                // Use Redux state as fallback
            }
        };
        loadProfile();
    }, []);

    const formik = useFormik({
        initialValues: { name: profileName },
        validationSchema: nameSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await changeName(values.name);
                toast.success('Name updated successfully!');
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                toast.error(err.response?.data?.message || 'Failed to update name');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="h-full overflow-auto bg-slate-950">
            <div className="max-w-2xl mx-auto py-10 px-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Profile</h1>
                        <p className="text-sm text-slate-400">Manage your account information</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-violet-500/20">
                        {profileName ? profileName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">{profileName}</h2>
                        <p className="text-sm text-slate-400">{profileEmail}</p>
                    </div>
                </div>

                {/* Personal Info Card */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-2 mb-5">
                        <User className="w-4 h-4 text-violet-400" />
                        <h3 className="text-sm font-semibold text-white">Personal Information</h3>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-300 text-sm">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                {...formik.getFieldProps('name')}
                                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-violet-500 h-11"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-400 text-xs">{formik.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300 text-sm flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-slate-500" />
                                Email
                            </Label>
                            <Input
                                value={profileEmail}
                                disabled
                                className="bg-slate-800/30 border-slate-700/30 text-slate-500 h-11 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500">Email cannot be changed</p>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={formik.isSubmitting || !formik.dirty}
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white"
                            >
                                {formik.isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                <Separator className="bg-slate-800/60 my-6" />

                {/* Security Card */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-violet-400" />
                        <h3 className="text-sm font-semibold text-white">Security</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                        Keep your account secure by updating your password regularly.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/change-password')}
                        className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600"
                    >
                        Change Password
                    </Button>
                </div>
            </div>
        </div>
    );
}
