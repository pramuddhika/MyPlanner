import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { fetchTasks } from '@/store/slices/taskSlice';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import taskService from '@/services/taskService';
import type { Task } from '@/types';
import dayjs from 'dayjs';
import { useState } from 'react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task;
    onSuccess?: () => void;
}

export function DeleteTaskDialog({ open, onOpenChange, task, onSuccess }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const currentMonth = useSelector((state: RootState) => state.ui.currentMonth);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await taskService.deleteTask(task.taskId);
            toast.success('Task deleted');
            const monthStart = dayjs(currentMonth + '-01');
            dispatch(
                fetchTasks({
                    startDate: monthStart.startOf('month').toISOString(),
                    endDate: monthStart.endOf('month').toISOString(),
                })
            );
            onOpenChange(false);
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Delete Task
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-slate-400">
                        Are you sure you want to delete &ldquo;{task.topic}&rdquo;? This action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-500 text-white"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
