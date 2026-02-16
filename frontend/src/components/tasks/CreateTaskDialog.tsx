import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { fetchTasks } from '@/store/slices/taskSlice';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Loader2, ListPlus } from 'lucide-react';
import taskService from '@/services/taskService';
import dayjs from 'dayjs';

const taskSchema = Yup.object().shape({
    topic: Yup.string()
        .min(1, 'Topic is required')
        .max(30, 'Topic must not exceed 30 characters')
        .required('Topic is required'),
    description: Yup.string().max(100, 'Description must not exceed 100 characters'),
    statusId: Yup.number().required('Status is required'),
    categoryId: Yup.number().nullable(),
    startTime: Yup.string().nullable(),
    endTime: Yup.string().nullable(),
    isRemainder: Yup.boolean(),
    remainderTime: Yup.string().nullable(),
});

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultDate?: string;
}

export function CreateTaskDialog({ open, onOpenChange, defaultDate }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const statuses = useSelector((state: RootState) => state.statuses.statuses);
    const categories = useSelector((state: RootState) => state.categories.categories);
    const currentMonth = useSelector((state: RootState) => state.ui.currentMonth);

    const formik = useFormik({
        initialValues: {
            topic: '',
            description: '',
            statusId: statuses.length > 0 ? statuses[0].statusId : 1,
            categoryId: null as number | null,
            startTime: defaultDate ? `${defaultDate}T00:00` : '',
            endTime: defaultDate ? `${defaultDate}T23:59` : '',
            isRemainder: false,
            remainderTime: '',
        },
        validationSchema: taskSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const payload = {
                    topic: values.topic,
                    description: values.description || undefined,
                    statusId: values.statusId,
                    categoryId: values.categoryId || undefined,
                    startTime: values.startTime
                        ? dayjs(values.startTime).format('YYYY-MM-DDTHH:mm:ss')
                        : undefined,
                    endTime: values.endTime
                        ? dayjs(values.endTime).format('YYYY-MM-DDTHH:mm:ss')
                        : undefined,
                    isRemainder: values.isRemainder,
                    remainderTime:
                        values.isRemainder && values.remainderTime
                            ? dayjs(values.remainderTime).format('YYYY-MM-DDTHH:mm:ss')
                            : undefined,
                };
                await taskService.createTask(payload);
                toast.success('Task created!');
                const monthStart = dayjs(currentMonth + '-01');
                dispatch(
                    fetchTasks({
                        startDate: monthStart.startOf('month').toISOString(),
                        endDate: monthStart.endOf('month').toISOString(),
                    })
                );
                resetForm();
                onOpenChange(false);
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                toast.error(err.response?.data?.message || 'Failed to create task');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <ListPlus className="w-5 h-5 text-violet-400" />
                        New Task
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4 mt-2">
                    {/* Topic */}
                    <div className="space-y-2">
                        <Label className="text-slate-300 text-sm">Topic *</Label>
                        <Input
                            placeholder="What needs to be done?"
                            {...formik.getFieldProps('topic')}
                            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-violet-500 h-10"
                        />
                        {formik.touched.topic && formik.errors.topic && (
                            <p className="text-red-400 text-xs">{formik.errors.topic}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-slate-300 text-sm">Description</Label>
                        <Input
                            placeholder="Optional details..."
                            {...formik.getFieldProps('description')}
                            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-violet-500 h-10"
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="text-red-400 text-xs">{formik.errors.description}</p>
                        )}
                    </div>

                    {/* Status & Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-slate-300 text-sm">Status *</Label>
                            <Select
                                value={formik.values.statusId.toString()}
                                onValueChange={(val) => formik.setFieldValue('statusId', Number(val))}
                            >
                                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-300 h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    {statuses.map((s) => (
                                        <SelectItem key={s.statusId} value={s.statusId.toString()} className="text-slate-300">
                                            {s.statusName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300 text-sm">Category</Label>
                            <Select
                                value={formik.values.categoryId?.toString() || 'none'}
                                onValueChange={(val) =>
                                    formik.setFieldValue('categoryId', val === 'none' ? null : Number(val))
                                }
                            >
                                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-300 h-10">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="none" className="text-slate-300">None</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.categoryId} value={c.categoryId.toString()} className="text-slate-300">
                                            {c.categoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Start & End Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-slate-300 text-sm">Start Time</Label>
                            <Input
                                type="datetime-local"
                                {...formik.getFieldProps('startTime')}
                                className="bg-slate-800/50 border-slate-700/50 text-slate-300 focus:border-violet-500 h-10 [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300 text-sm">End Time</Label>
                            <Input
                                type="datetime-local"
                                {...formik.getFieldProps('endTime')}
                                className="bg-slate-800/50 border-slate-700/50 text-slate-300 focus:border-violet-500 h-10 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Reminder */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formik.values.isRemainder}
                                onChange={(e) => formik.setFieldValue('isRemainder', e.target.checked)}
                                className="rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500/20"
                            />
                            <span className="text-sm text-slate-300">Set Reminder</span>
                        </label>

                        {formik.values.isRemainder && (
                            <div className="space-y-2">
                                <Label className="text-slate-300 text-sm">Reminder Time</Label>
                                <Input
                                    type="datetime-local"
                                    {...formik.getFieldProps('remainderTime')}
                                    className="bg-slate-800/50 border-slate-700/50 text-slate-300 focus:border-violet-500 h-10 [color-scheme:dark]"
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
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
                            {formik.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
