import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { fetchTasks } from '@/store/slices/taskSlice';
import { fetchCategories } from '@/store/slices/categorySlice';
import { fetchStatuses } from '@/store/slices/statusSlice';
import CalendarView from '@/components/calendar/CalendarView';
import DayTaskList from '@/components/calendar/DayTaskList';
import TaskDetailPanel from '@/components/calendar/TaskDetailPanel';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

export default function DashboardPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading } = useSelector((state: RootState) => state.tasks);
    const { currentMonth, rightPanelOpen, selectedTaskId, selectedDate, calendarFilters } = useSelector(
        (state: RootState) => state.ui
    );
    const categories = useSelector((state: RootState) => state.categories.categories);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Initialize WebSocket notifications
    useNotifications();

    // Update document title based on active view
    useEffect(() => {
        const today = dayjs().format('YYYY-MM-DD');
        
        if (calendarFilters.categoryId) {
            const category = categories.find(c => c.categoryId === calendarFilters.categoryId);
            document.title = category ? `${category.categoryName} | My Planner` : 'My Planner';
        } else if (selectedDate === today) {
            document.title = 'Today | My Planner';
        } else if (selectedDate === null) {
            document.title = 'All Tasks | My Planner';
        } else {
            document.title = `${dayjs(selectedDate).format('MMM D, YYYY')} | My Planner`;
        }

        return () => {
            document.title = 'My Planner';
        };
    }, [selectedDate, calendarFilters.categoryId, categories]);

    // Fetch tasks when month changes
    useEffect(() => {
        const monthStart = dayjs(currentMonth + '-01');
        dispatch(
            fetchTasks({
                startDate: monthStart.startOf('month').toISOString(),
                endDate: monthStart.endOf('month').toISOString(),
            })
        );
    }, [dispatch, currentMonth]);

    // Fetch categories and statuses on mount
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchStatuses());
    }, [dispatch]);

    return (
        <div className="h-full flex overflow-hidden relative">
            {/* Calendar — Main Area */}
            <div className={cn('flex-1 transition-all duration-300', rightPanelOpen && 'mr-0')}>
                {loading && (
                    <div className="absolute top-4 right-4 z-10">
                        <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                    </div>
                )}
                <CalendarView tasks={tasks} />
            </div>

            {/* Right Panel — Day Tasks or Task Detail */}
            <div
                className={cn(
                    'transition-all duration-300 ease-in-out overflow-hidden',
                    rightPanelOpen ? 'w-[340px]' : 'w-0'
                )}
            >
                {rightPanelOpen && (
                    <div className="w-[340px] h-full">
                        {selectedTaskId ? (
                            <TaskDetailPanel tasks={tasks} />
                        ) : (
                            <DayTaskList tasks={tasks} />
                        )}
                    </div>
                )}
            </div>

            {/* Floating create button */}
            <Button
                onClick={() => setCreateDialogOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-2xl shadow-violet-500/30 transition-all hover:scale-105 z-50"
                size="icon"
            >
                <Plus className="w-6 h-6" />
            </Button>

            <CreateTaskDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                defaultDate={selectedDate || dayjs().format('YYYY-MM-DD')}
            />
        </div>
    );
}
