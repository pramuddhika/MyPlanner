import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { fetchCategories } from '@/store/slices/categorySlice';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Loader2, FolderPlus } from 'lucide-react';
import categoryService from '@/services/categoryService';

const categorySchema = Yup.object().shape({
    categoryName: Yup.string()
        .min(1, 'Category name is required')
        .max(50, 'Category name must not exceed 50 characters')
        .required('Category name is required'),
});

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateCategoryDialog({ open, onOpenChange }: Props) {
    const dispatch = useDispatch<AppDispatch>();

    const formik = useFormik({
        initialValues: { categoryName: '' },
        validationSchema: categorySchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await categoryService.createCategory(values);
                toast.success('Category created!');
                dispatch(fetchCategories());
                resetForm();
                onOpenChange(false);
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                toast.error(err.response?.data?.message || 'Failed to create category');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <FolderPlus className="w-5 h-5 text-violet-400" />
                        New Category
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="categoryName" className="text-slate-300 text-sm">
                            Category Name
                        </Label>
                        <Input
                            id="categoryName"
                            placeholder="e.g. Homework, Work, Personal"
                            {...formik.getFieldProps('categoryName')}
                            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-violet-500 h-10"
                        />
                        {formik.touched.categoryName && formik.errors.categoryName && (
                            <p className="text-red-400 text-xs">{formik.errors.categoryName}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
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
                                'Create'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
