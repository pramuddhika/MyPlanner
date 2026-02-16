import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { setSelectedTaskId } from '@/store/slices/uiSlice';
import { fetchTasks } from '@/store/slices/taskSlice';
import type { Task } from '@/types';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Clock,
    CalendarDays,
    Bell,
    Folder,
    FileText,
} from 'lucide-react';
import { useState } from 'react';
import { EditTaskDialog } from '@/components/tasks/EditTaskDialog';
import { DeleteTaskDialog } from '@/components/tasks/DeleteTaskDialog';

const STATUS_BADGE: Record<string, string> = {
    'To Do': 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25',
    'In Progress': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25',
    'Completed': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    'Done': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
};

interface TaskDetailPanelProps {
    tasks: Task[];
}

export default function TaskDetailPanel({ tasks }: TaskDetailPanelProps) {
    const dispatch = useDispatch<AppDispatch>();
    const selectedTaskId = useSelector((state: RootState) => state.ui.selectedTaskId);
    const currentMonth = useSelector((state: RootState) => state.ui.currentMonth);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (!selectedTaskId) return null;

    const task = tasks.find((t) => t.taskId === selectedTaskId);
    if (!task) return null;

    const handleDeleteSuccess = () => {
        dispatch(setSelectedTaskId(null));
        const monthStart = dayjs(currentMonth + '-01');
        dispatch(
            fetchTasks({
                startDate: monthStart.startOf('month').toISOString(),
                endDate: monthStart.endOf('month').toISOString(),
            })
        );
    };

    return (
        <div className="h-full flex flex-col bg-white/70 dark:bg-slate-900/50 border-l border-gray-200 dark:border-slate-800/60">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-800/60">
                <button
                    onClick={() => dispatch(setSelectedTaskId(null))}
                    className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-medium">Back to list</span>
                </button>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditOpen(true)}
                        className="text-slate-400 hover:text-violet-300 hover:bg-violet-500/10"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteOpen(true)}
                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto px-5 py-4 space-y-5">
                {/* Title & Status */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{task.topic}</h3>
                    <Badge
                        variant="outline"
                        className={cn(
                            'text-xs',
                            STATUS_BADGE[task.status.statusName] || 'bg-gray-200 dark:bg-slate-700/50 text-gray-600 dark:text-slate-300'
                        )}
                    >
                        {task.status.statusName}
                    </Badge>
                </div>

                {/* Description */}
                {task.description && (
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                            <span className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                                Description
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{task.description}</p>
                    </div>
                )}

                <Separator className="bg-gray-200 dark:bg-slate-800/60" />

                {/* Details */}
                <div className="space-y-3">
                    {task.category && (
                        <div className="flex items-center gap-3">
                            <Folder className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                            <div>
                                <span className="text-xs text-gray-400 dark:text-slate-500 block">Category</span>
                                <span className="text-sm text-gray-700 dark:text-slate-300">{task.category.categoryName}</span>
                            </div>
                        </div>
                    )}

                    {task.startTime && (
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                            <div>
                                <span className="text-xs text-gray-400 dark:text-slate-500 block">Start Time</span>
                                <span className="text-sm text-gray-700 dark:text-slate-300">
                                    {dayjs(task.startTime).format('MMM D, YYYY · h:mm A')}
                                </span>
                            </div>
                        </div>
                    )}

                    {task.endTime && (
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                            <div>
                                <span className="text-xs text-gray-400 dark:text-slate-500 block">End Time</span>
                                <span className="text-sm text-gray-700 dark:text-slate-300">
                                    {dayjs(task.endTime).format('MMM D, YYYY · h:mm A')}
                                </span>
                            </div>
                        </div>
                    )}

                    {task.isRemainder && task.remainderTime && (
                        <div className="flex items-center gap-3">
                            <Bell className="w-4 h-4 text-violet-400" />
                            <div>
                                <span className="text-xs text-gray-400 dark:text-slate-500 block">Reminder</span>
                                <span className="text-sm text-gray-700 dark:text-slate-300">
                                    {dayjs(task.remainderTime).format('MMM D, YYYY · h:mm A')}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                        <div>
                            <span className="text-xs text-gray-400 dark:text-slate-500 block">Created</span>
                            <span className="text-sm text-gray-700 dark:text-slate-300">
                                {dayjs(task.createTime).format('MMM D, YYYY · h:mm A')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <EditTaskDialog open={editOpen} onOpenChange={setEditOpen} task={task} />
            <DeleteTaskDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                task={task}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}
