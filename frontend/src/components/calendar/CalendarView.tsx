import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  setSelectedDate,
  setCurrentMonth,
  setCalendarFilters,
  clearCalendarFilters,
} from "@/store/slices/uiSlice";
import type { Task } from "@/types";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "To Do": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "In Progress": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Done: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const STATUS_DOT: Record<string, string> = {
  "To Do": "bg-blue-400",
  "In Progress": "bg-amber-400",
  Completed: "bg-emerald-400",
  Done: "bg-emerald-400",
};

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentMonth, selectedDate, calendarFilters } = useSelector(
    (state: RootState) => state.ui,
  );
  const statuses = useSelector((state: RootState) => state.statuses.statuses);

  const currentMonthDate = dayjs(currentMonth + "-01");

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (
        calendarFilters.statusId &&
        task.status.statusId !== calendarFilters.statusId
      )
        return false;
      if (
        calendarFilters.categoryId &&
        task.category?.categoryId !== calendarFilters.categoryId
      )
        return false;
      return true;
    });
  }, [tasks, calendarFilters]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    filteredTasks.forEach((task) => {
      const date = task.startTime
        ? dayjs(task.startTime).format("YYYY-MM-DD")
        : dayjs(task.createTime).format("YYYY-MM-DD");
      if (!map[date]) map[date] = [];
      map[date].push(task);
    });
    return map;
  }, [filteredTasks]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonthDate.startOf("month");
    const endOfMonth = currentMonthDate.endOf("month");
    const startDay = startOfMonth.day(); // 0=Sunday
    const daysInMonth = endOfMonth.date();

    const days: Array<{ date: dayjs.Dayjs; isCurrentMonth: boolean }> = [];

    // Previous month fillers
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: startOfMonth.subtract(i + 1, "day"),
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: currentMonthDate.date(i),
        isCurrentMonth: true,
      });
    }

    // Next month fillers (fill to 42 = 6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: endOfMonth.add(i, "day"),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonthDate]);

  const today = dayjs().format("YYYY-MM-DD");
  const hasActiveFilters =
    calendarFilters.statusId;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                dispatch(
                  setCurrentMonth(
                    currentMonthDate.subtract(1, "month").format("YYYY-MM"),
                  ),
                )
              }
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                dispatch(
                  setCurrentMonth(
                    currentMonthDate.add(1, "month").format("YYYY-MM"),
                  ),
                )
              }
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <h2 className="text-xl font-bold text-white">
            {currentMonthDate.format("MMMM YYYY")}
          </h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <Select
            value={calendarFilters.statusId?.toString() || "all"}
            onValueChange={(val) =>
              dispatch(
                setCalendarFilters({
                  statusId: val === "all" ? null : Number(val),
                }),
              )
            }
          >
            <SelectTrigger className="w-[130px] h-8 bg-slate-800/50 border-slate-700/50 text-slate-300 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-slate-300 text-xs">
                All Status
              </SelectItem>
              {statuses.map((s) => (
                <SelectItem
                  key={s.statusId}
                  value={s.statusId.toString()}
                  className="text-slate-300 text-xs"
                >
                  {s.statusName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => dispatch(clearCalendarFilters())}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-slate-800/60">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 overflow-hidden">
        {calendarDays.map(({ date, isCurrentMonth }, idx) => {
          const dateStr = date.format("YYYY-MM-DD");
          const dayTasks = tasksByDate[dateStr] || [];
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={idx}
              onClick={() => dispatch(setSelectedDate(dateStr))}
              className={cn(
                "relative flex flex-col items-start p-1.5 border-r border-b border-slate-800/40 transition-all duration-150 text-left overflow-hidden",
                "hover:bg-slate-800/30",
                !isCurrentMonth && "bg-slate-950/50",
                isSelected && "bg-violet-500/10 ring-1 ring-violet-500/30",
                isToday && !isSelected && "bg-violet-500/5",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full",
                  isCurrentMonth ? "text-slate-300" : "text-slate-600",
                  isToday && "bg-violet-600 text-white font-bold shadow-sm",
                  isSelected && !isToday && "text-violet-300",
                )}
              >
                {date.date()}
              </span>

              {/* Task pills */}
              <div className="w-full space-y-0.5 overflow-hidden">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.taskId}
                    className={cn(
                      "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate",
                      STATUS_COLORS[task.status.statusName] ||
                        "bg-slate-700/50 text-slate-300",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        STATUS_DOT[task.status.statusName] || "bg-slate-400",
                      )}
                    />
                    <span className="truncate">{task.topic}</span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-[9px] h-4 px-1 bg-slate-700/50 text-slate-400"
                  >
                    +{dayTasks.length - 3} more
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
