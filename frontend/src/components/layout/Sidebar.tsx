import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { RootState, AppDispatch } from '@/store';
import { toggleSidebar, setSelectedDate } from '@/store/slices/uiSlice';
import { fetchCategories, deleteCategory } from '@/store/slices/categorySlice';
import { CreateCategoryDialog } from '@/components/categories/CreateCategoryDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    CheckSquare,
    CalendarDays,
    ListTodo,
    PanelLeftClose,
    PanelLeft,
    Plus,
    LogOut,
    Trash2,
    Folder,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

export default function Sidebar() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, name } = useAuth();
    const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
    const selectedCategoryId = useSelector((state: RootState) => state.ui.calendarFilters.categoryId);
    const categories = useSelector((state: RootState) => state.categories.categories);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleDeleteCategory = async (categoryId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await dispatch(deleteCategory(categoryId)).unwrap();
            toast.success('Category deleted');
        } catch (error) {
            toast.error(error as string);
        }
    };

    const handleTodayClick = () => {
        dispatch(setSelectedDate(dayjs().format('YYYY-MM-DD')));
        if (location.pathname !== '/dashboard') navigate('/dashboard');
    };

    const handleAllTasksClick = () => {
        dispatch(setSelectedDate(null));
        if (location.pathname !== '/dashboard') navigate('/dashboard');
    };

    const userInitial = name ? name.charAt(0).toUpperCase() : '?';
    const selectedDate = useSelector((state: RootState) => state.ui.selectedDate);
    const today = dayjs().format('YYYY-MM-DD');
    
    const isTodayActive = location.pathname === '/dashboard' && selectedDate === today && !selectedCategoryId;
    const isAllTasksActive = location.pathname === '/dashboard' && selectedDate === null && !selectedCategoryId;

    return (
        <div
            className={cn(
                'h-screen bg-slate-950 border-r border-slate-800/60 flex flex-col transition-all duration-300 ease-in-out',
                collapsed ? 'w-[68px]' : 'w-[260px]'
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16">
                {!collapsed && (
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <CheckSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">MyPlanner</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => dispatch(toggleSidebar())}
                    className="text-slate-400 hover:text-white hover:bg-slate-800/60"
                >
                    {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </Button>
            </div>

            <Separator className="bg-slate-800/60" />

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-3">
                <div className="space-y-1">
                    {/* Today */}
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={handleTodayClick}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                                    'text-slate-300 hover:text-white hover:bg-slate-800/60',
                                    isTodayActive && 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                                )}
                            >
                                <CalendarDays className="w-4 h-4 shrink-0" />
                                {!collapsed && <span>Today</span>}
                            </button>
                        </TooltipTrigger>
                        {collapsed && (
                            <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                                Today
                            </TooltipContent>
                        )}
                    </Tooltip>

                    {/* All Tasks */}
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={handleAllTasksClick}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                                    'text-slate-300 hover:text-white hover:bg-slate-800/60',
                                    isAllTasksActive && 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                                )}
                            >
                                <ListTodo className="w-4 h-4 shrink-0" />
                                {!collapsed && <span>All Tasks</span>}
                            </button>
                        </TooltipTrigger>
                        {collapsed && (
                            <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                                All Tasks
                            </TooltipContent>
                        )}
                    </Tooltip>
                </div>

                {/* Categories Section */}
                {!collapsed && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between px-3 mb-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Categories
                            </span>
                            <button
                                onClick={() => setCategoryDialogOpen(true)}
                                className="text-slate-500 hover:text-violet-400 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-0.5">
                            {categories.map((cat) => (
                                <div
                                    key={cat.categoryId}
                                    className="group flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-150 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Folder className="w-4 h-4 shrink-0 text-slate-500" />
                                        <span className="truncate">{cat.categoryName}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteCategory(cat.categoryId, e)}
                                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {collapsed && (
                    <div className="mt-4">
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setCategoryDialogOpen(true)}
                                    className="w-full flex items-center justify-center py-2.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-800/60 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                                Add Category
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
            </ScrollArea>

            <Separator className="bg-slate-800/60" />

            {/* Footer */}
            <div className="p-3 space-y-1">
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => navigate('/profile')}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                                'text-slate-300 hover:text-white hover:bg-slate-800/60',
                                location.pathname === '/profile' && 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                            )}
                        >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                {userInitial}
                            </div>
                            {!collapsed && <span className="truncate">{name || 'Profile'}</span>}
                        </button>
                    </TooltipTrigger>
                    {collapsed && (
                        <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                            Profile
                        </TooltipContent>
                    )}
                </Tooltip>

                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                        >
                            <LogOut className="w-4 h-4 shrink-0" />
                            {!collapsed && <span>Logout</span>}
                        </button>
                    </TooltipTrigger>
                    {collapsed && (
                        <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                            Logout
                        </TooltipContent>
                    )}
                </Tooltip>
            </div>

            <CreateCategoryDialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen} />
        </div>
    );
}
