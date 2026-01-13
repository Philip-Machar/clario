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
      if (!base[key]) base.todo.push(task);
      else base[key].push(task);
    }
    return base;
  }, [safeTasks]);

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_22px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl px-4 pt-4 pb-5 flex flex-col">
      <header className="flex items-center justify-between px-1 pb-3">
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
      <div className="mb-4 grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_120px] gap-2 text-xs">
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
        <select
          value={newTaskPriority}
          onChange={e =>
            setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')
          }
          className="rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60"
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
      </div>

      {/* Columns */}
      <div className="flex-1 grid grid-cols-3 gap-3 text-xs">
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
                className="rounded-2xl bg-slate-900/70 border border-slate-800/90 flex flex-col"
              >
                <div className="flex items-center justify-between px-3 pt-3 pb-2">
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

                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 custom-scroll">
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
                    <button
                      key={task.id}
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
                      className="w-full rounded-2xl bg-slate-900/90 border border-slate-800/80 px-3 py-3 text-left hover:border-emerald-400/60 hover:bg-slate-900 transition-colors group"
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

