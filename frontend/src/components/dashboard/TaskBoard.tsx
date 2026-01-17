import { FC, useMemo } from 'react';
import type { Task } from '../../types';

export type BoardColumnKey = 'todo' | 'in_progress' | 'complete';

interface TaskBoardProps {
  tasks: Task[] | null | undefined;
  isLoading: boolean;
  onCreateTask: () => void;
  isCreating: boolean;
  newTaskTitle: string;
  newTaskDescription: string;
  newTaskPriority: 'low' | 'medium' | 'high';
  setNewTaskTitle: (value: string) => void;
  setNewTaskDescription: (value: string) => void;
  setNewTaskPriority: (value: 'low' | 'medium' | 'high') => void;
  onStatusChange: (task: Task, status: BoardColumnKey) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
}

const TaskBoard: FC<TaskBoardProps> = ({
  tasks,
  isLoading,
  onCreateTask,
  isCreating,
  newTaskTitle,
  newTaskDescription,
  newTaskPriority,
  setNewTaskTitle,
  setNewTaskDescription,
  setNewTaskPriority,
  onStatusChange,
  onUpdateTask,
  onDeleteTask,
}) => {
  const safeTasks = tasks ?? [];
  const groupedTasks = useMemo(() => {
    const base: Record<BoardColumnKey, Task[]> = {
      todo: [],
      in_progress: [],
      complete: [],
    };
    for (const task of safeTasks) {
      const key = (task.status || 'todo') as BoardColumnKey;
      if (base[key]) {
        base[key].push(task);
      } else {
        // Fallback to todo if status is invalid
        base.todo.push(task);
      }
    }
    return base;
  }, [safeTasks]);

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_22px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl px-4 pt-3 pb-4 flex flex-col h-full overflow-hidden">
      <style>{`
        .task-column-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .task-column-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        .task-column-scroll::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.6);
          border-radius: 3px;
        }
        .task-column-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(51, 65, 85, 0.8);
        }
      `}</style>
      <header className="flex items-center justify-between px-1 pb-2">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Taskboard
          </div>
          <div className="mt-1 text-sm text-slate-300">
            Shape your day in three columns.
          </div>
        </div>
        <button
          onClick={onCreateTask}
          disabled={isCreating || !newTaskTitle.trim()}
          className="rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? 'Adding…' : 'Add task'}
        </button>
      </header>

      {/* Quick add row */}
      <div className="mb-3 grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_120px] gap-2 text-xs">
        <input
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
          className="rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60"
        />
        <input
          value={newTaskDescription}
          onChange={e => setNewTaskDescription(e.target.value)}
          placeholder="Optional description"
          className="rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60"
        />
        <div className="relative">
          <select
            value={newTaskPriority}
            onChange={e =>
              setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')
            }
            className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 pr-8 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238c9ca6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '12px 8px'
            }}
          >
            <option value="low" className="bg-slate-900 text-slate-100">Low</option>
            <option value="medium" className="bg-slate-900 text-slate-100">Medium</option>
            <option value="high" className="bg-slate-900 text-slate-100">High</option>
          </select>
        </div>
      </div>

      {/* Columns */}
      <div className="flex-1 grid grid-cols-3 gap-2 text-xs min-h-0">
        {(['todo', 'in_progress', 'complete'] as BoardColumnKey[]).map(
          columnKey => {
            const columnTasks = groupedTasks[columnKey];
            const labelMap: Record<BoardColumnKey, string> = {
              todo: 'To Do',
              in_progress: 'In Progress',
              complete: 'Done',
            };

            return (
              <div
                key={columnKey}
                className="rounded-2xl bg-slate-900/70 border border-slate-800/90 flex flex-col min-h-0"
              >
                <div className="flex items-center justify-between px-3 pt-2 pb-1.5 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                      {labelMap[columnKey]}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300">
                    {isLoading ? '—' : columnTasks.length}
                  </span>
                </div>

                <div 
                  className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-0 task-column-scroll"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(51, 65, 85, 0.6) transparent'
                  }}
                >
                  {isLoading && (
                    <div className="flex items-center justify-center py-6 text-[11px] text-slate-500">
                      Loading tasks…
                    </div>
                  )}
                  {!isLoading && columnTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-700/80 bg-slate-900/60 px-3 py-4 text-[11px] text-slate-500 text-center">
                      No tasks here yet.
                    </div>
                  )}

                  {columnTasks.map(task => (
                    <div
                      key={task.id}
                      className="w-full rounded-2xl bg-slate-900/90 border border-slate-800/80 px-3 py-3 hover:border-emerald-400/60 hover:bg-slate-900 transition-colors group"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus: Record<BoardColumnKey, BoardColumnKey> =
                            {
                              todo: 'in_progress',
                              in_progress: 'complete',
                              complete: 'todo',
                            };
                          onStatusChange(task, nextStatus[columnKey]);
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="text-[12px] font-medium text-slate-100 line-clamp-2">
                            {task.title}
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              task.priority === 'high'
                                ? 'border-rose-400/80 text-rose-200 bg-rose-500/10'
                                : task.priority === 'medium'
                                ? 'border-amber-300/80 text-amber-100 bg-amber-400/10'
                                : 'border-slate-500 text-slate-200 bg-slate-500/10'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-3">
                            {task.description}
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                          <span>
                            {task.due_date
                              ? new Date(task.due_date).toLocaleDateString()
                              : 'No due date'}
                          </span>
                          <span className="text-emerald-300/80 opacity-0 group-hover:opacity-100 transition-opacity">
                            Move to next column
                          </span>
                        </div>
                      </button>
                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onUpdateTask && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateTask(task);
                            }}
                            className="flex-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 px-2 py-1.5 text-[10px] font-medium text-slate-300 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        {onDeleteTask && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this task?')) {
                                onDeleteTask(task.id);
                              }
                            }}
                            className="flex-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 px-2 py-1.5 text-[10px] font-medium text-rose-300 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
};

export default TaskBoard;

