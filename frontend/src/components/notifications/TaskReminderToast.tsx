import toast, { type Toast } from 'react-hot-toast';
import { Bell, Clock, X } from 'lucide-react';

interface TaskReminderToastProps {
    t: Toast;
    topic: string;
    message: string;
    timestamp: string;
}

export const TaskReminderToast = ({ t, topic, message, timestamp }: TaskReminderToastProps) => {
    const formattedTime = (() => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    })();

    return (
        <div
            className={`${
                t.visible ? 'animate-in slide-in-from-right fade-in' : 'animate-out slide-out-to-right fade-out'
            } max-w-sm w-full pointer-events-auto overflow-hidden rounded-xl border border-violet-500/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl shadow-violet-500/10 backdrop-blur-sm`}
        >
            {/* Accent bar */}
            <div className="h-1 w-full bg-linear-to-r from-violet-500 via-purple-500 to-violet-400" />

            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-violet-500/15 border border-violet-500/20">
                        <Bell className="w-5 h-5 text-violet-400 animate-pulse" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-violet-300 tracking-wide uppercase">
                                Reminder
                            </p>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="shrink-0 p-1 rounded-md text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white truncate" title={topic}>
                            {topic}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400 line-clamp-2">
                            {message}
                        </p>

                        {formattedTime && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>{formattedTime}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
