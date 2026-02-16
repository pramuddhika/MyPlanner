import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { setSelectedTaskId, closeRightPanel } from '@/store/slices/uiSlice';
import type { Task } from '@/types';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';

const STATUS_BADGE: Record<string, string> = {
    'To Do': 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25',
    'In Progress': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25',
    'Completed': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    'Done': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
};

interface DayTaskListProps {
    tasks: Task[];
}

export default function DayTaskList({ tasks }: DayTaskListProps) {
    const dispatch = useDispatch<AppDispatch>();
    const selectedDate = useSelector((state: RootState) => state.ui.selectedDate);
    const selectedTaskId = useSelector((state: RootState) => state.ui.selectedTaskId);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    if (!selectedDate) return null;

    // Filter tasks for selected date
    const dayTasks = tasks.filter((task) => {
        const taskDate = task.startTime
            ? dayjs(task.startTime).format('YYYY-MM-DD')
            : dayjs(task.createTime).format('YYYY-MM-DD');
        return taskDate === selectedDate;
    });

    const formattedDate = dayjs(selectedDate).format('ddd, MMM D, YYYY');

    return (
        <div className="h-full flex flex-col bg-white/70 dark:bg-slate-900/50 border-l border-gray-200 dark:border-slate-800/60">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-800/60">
                <div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-violet-400" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{formattedDate}</h3>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                        {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setCreateDialogOpen(true)}
                        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => dispatch(closeRightPanel())}
                        className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Task List */}
            <ScrollArea className="flex-1 px-3 py-2">
                {dayTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800/60 flex items-center justify-center mb-3">
                            <Calendar className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                        </div>
                        <p className="text-sm text-gray-400 dark:text-slate-500 mb-1">No tasks for this day</p>
                        <button
                            onClick={() => setCreateDialogOpen(true)}
                            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            + Create a task
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {dayTasks.map((task) => (
                            <button
                                key={task.taskId}
                                onClick={() => dispatch(setSelectedTaskId(task.taskId))}
                                className={cn(
                                    'w-full text-left p-3 rounded-xl border transition-all duration-150',
                                    selectedTaskId === task.taskId
                                        ? 'bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/5'
                                        : 'bg-gray-50 dark:bg-slate-800/30 border-gray-200 dark:border-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:border-gray-300 dark:hover:border-slate-700/60'
                                )}
                            >
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.topic}</h4>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'text-[10px] shrink-0',
                                            STATUS_BADGE[task.status.statusName] || 'bg-gray-200 dark:bg-slate-700/50 text-gray-600 dark:text-slate-300'
                                        )}
                                    >
                                        {task.status.statusName}
                                    </Badge>
                                </div>

                                {task.description && (
                                    <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-2">{task.description}</p>
                                )}

                                <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-slate-500">
                                    {task.startTime && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {dayjs(task.startTime).format('h:mm A')}
                                        </span>
                                    )}
                                    {task.category && (
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] h-4 border-gray-200 dark:border-slate-700/50 text-gray-500 dark:text-slate-400"
                                        >
                                            {task.category.categoryName}
                                        </Badge>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <CreateTaskDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                defaultDate={selectedDate}
            />
        </div>
    );
}
