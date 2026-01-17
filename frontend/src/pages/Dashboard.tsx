import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Task } from '../types';
import { fetchTasks, updateTaskStatus, createTask, updateTask, deleteTask } from '../features/tasks/taskService';
import { sendMentorMessage } from '../features/chat/chatService';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TodaysOverview from '../components/dashboard/TodaysOverview';
import ControlHub from '../components/dashboard/ControlHub';
import TaskBoard, { BoardColumnKey } from '../components/dashboard/TaskBoard';
import MentorChat, { MentorMessage } from '../components/dashboard/MentorChat';

const Dashboard = () => {
  const { logout, user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([]);
  const [mentorInput, setMentorInput] = useState('');
  const [isSendingMentor, setIsSendingMentor] = useState(false);

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Edit task state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editTaskStatus, setEditTaskStatus] = useState<BoardColumnKey>('todo');
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  // Initial load
  useEffect(() => {
    const load = async () => {
      try {
        const tasksData = await fetchTasks();
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoadingTasks(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (task: Task, status: BoardColumnKey) => {
    try {
      setTasks(prev =>
        prev.map(t => (t.id === task.id ? { ...t, status } : t)),
      );
      await updateTaskStatus(task.id, status);
    } catch (error) {
      console.error('Failed to update status', error);
      // Ideally refetch tasks if this fails
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      setIsCreatingTask(true);
      const created = await createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        priority: newTaskPriority,
        status: 'todo',
      });
      setTasks(prev => [created, ...prev]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
    } catch (error) {
      console.error('Failed to create task', error);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleUpdateTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || '');
    setEditTaskPriority(task.priority);
    setEditTaskStatus(task.status as BoardColumnKey);
  };

  const handleSaveTask = async () => {
    if (!editingTask || !editTaskTitle.trim()) return;
    try {
      setIsUpdatingTask(true);
      const updated = await updateTask({
        id: editingTask.id,
        title: editTaskTitle.trim(),
        description: editTaskDescription.trim(),
        status: editTaskStatus,
        priority: editTaskPriority,
        due_date: editingTask.due_date || null,
      });
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
      setEditingTask(null);
      setEditTaskTitle('');
      setEditTaskDescription('');
      setEditTaskPriority('medium');
      setEditTaskStatus('todo');
    } catch (error) {
      console.error('Failed to update task', error);
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      setIsDeletingTask(true);
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task', error);
    } finally {
      setIsDeletingTask(false);
    }
  };

  const handleSendMentor = async () => {
    const trimmed = mentorInput.trim();
    if (!trimmed) return;

    const userMsg: MentorMessage = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: trimmed,
    };

    setMentorMessages(prev => [...prev, userMsg]);
    setMentorInput('');
    setIsSendingMentor(true);

    try {
      const res = await sendMentorMessage(trimmed);
      const mentorMsg: MentorMessage = {
        id: `mentor-${Date.now()}`,
        from: 'mentor',
        text: res.response,
      };
      setMentorMessages(prev => [...prev, mentorMsg]);
    } catch (error) {
      console.error('Failed to send mentor message', error);
    } finally {
      setIsSendingMentor(false);
    }
  };

  return (
    <div className="h-screen bg-[#050712] text-slate-50 flex flex-col overflow-hidden">
      <DashboardHeader user={user} onLogout={logout} />
      <TodaysOverview tasks={tasks} isLoading={isLoadingTasks} />

      {/* Main grid */}
      <main className="flex-1 px-10 pb-4 grid grid-cols-[minmax(260px,280px)_minmax(0,1.6fr)_minmax(260px,320px)] gap-4 min-h-0">
        <ControlHub tasks={tasks} />

        <TaskBoard
          tasks={tasks}
          isLoading={isLoadingTasks}
          onCreateTask={handleCreateTask}
          isCreating={isCreatingTask}
          newTaskTitle={newTaskTitle}
          newTaskDescription={newTaskDescription}
          newTaskPriority={newTaskPriority}
          setNewTaskTitle={setNewTaskTitle}
          setNewTaskDescription={setNewTaskDescription}
          setNewTaskPriority={setNewTaskPriority}
          onStatusChange={handleStatusChange}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />

        <MentorChat
          messages={mentorMessages}
          input={mentorInput}
          setInput={setMentorInput}
          onSend={handleSendMentor}
          isSending={isSendingMentor}
        />
      </main>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/95 shadow-[0_22px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-100">Edit Task</h2>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setEditTaskTitle('');
                  setEditTaskDescription('');
                  setEditTaskPriority('medium');
                  setEditTaskStatus('todo');
                }}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Title</label>
                <input
                  value={editTaskTitle}
                  onChange={e => setEditTaskTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Description</label>
                <textarea
                  value={editTaskDescription}
                  onChange={e => setEditTaskDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60 resize-none"
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Priority</label>
                  <div className="relative">
                    <select
                      value={editTaskPriority}
                      onChange={e => setEditTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 pr-8 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60 appearance-none cursor-pointer"
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

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Status</label>
                  <div className="relative">
                    <select
                      value={editTaskStatus}
                      onChange={e => setEditTaskStatus(e.target.value as BoardColumnKey)}
                      className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 pr-8 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238c9ca6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '12px 8px'
                      }}
                    >
                      <option value="todo" className="bg-slate-900 text-slate-100">To Do</option>
                      <option value="in_progress" className="bg-slate-900 text-slate-100">In Progress</option>
                      <option value="complete" className="bg-slate-900 text-slate-100">Done</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setEditTaskTitle('');
                    setEditTaskDescription('');
                    setEditTaskPriority('medium');
                    setEditTaskStatus('todo');
                  }}
                  className="flex-1 rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  disabled={isUpdatingTask || !editTaskTitle.trim()}
                  className="flex-1 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdatingTask ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
